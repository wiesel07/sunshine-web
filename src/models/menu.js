import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import { menu } from '../defaultSettings';
import { getMockMenuData } from '@/services/api';
import { getMenuTree } from '@/services/menu';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  if (!data) {
    return undefined;
  }
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName && parentName !== '/') {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }
      // if enableMenuLocale use item.name,
      // close menu international
      const name = menu.disableLocal
        ? item.name
        : formatMessage({ id: locale, defaultMessage: item.name });
      const result = {
        ...item,
        name,
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  if (!menuData) {
    return {};
  }
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

//每次格式化菜单的时候，都顺便设置一下菜单编码
let authArray = [];
// 格式化后台返回的菜单数据
function formatterMenu(data, parentIds = []) {
  if (!data) {
    return undefined;
  }
  let meunus = [];

  for (var i = 0; i < data.length; i++) {
    let item = data[i];
    let newItem = null;
    const { name, menuUrl, menuType, code:menuCode, menuIcon, children } = item;
    if (menuType === '2') {
       authArray.push(menuCode);
    }
    let menuCodes = [...parentIds]; // 当前展开的菜单 selectKey
    menuCodes.push(menuCode);
    if (children && children.length) {
      newItem = {
        name,
        path: menuUrl,
        icon: menuIcon,
        menuType,
        menuCode,
        menuCodes,
        children: formatterMenu(children,menuCodes)
      }

    } else {
      if (menuType !== '2') {
        newItem = {
          name,
          path: menuUrl,
          icon: menuIcon,
          menuType,
          menuCodes,
          menuCode,
        }
      }
    }
    if (newItem) {
      meunus.push(newItem)
    }
  }
  return meunus;
}


export default {
  namespace: 'menu',

  state: {
    menuData: [],
    routerData: [],
    breadcrumbNameMap: {},
  },

  effects: {
    *getMenuData({ payload }, { put }) {
      const { routes, authority, path } = payload;
      const originalMenuData = memoizeOneFormatter(routes, authority, path);
      const menuData = filterMenuData(originalMenuData);
      console.log(menuData[0])
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(originalMenuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap, routerData: routes },
      });
    },


    // *getMenuData({ payload }, { call, put }) {  

    //   const { routes, authority, path } = payload;
    //  // let menuData = yield call(getMockMenuData);
    //   let menuData = yield call(getMenuTree);
    //   menuData = formatterMenu(menuData.data);

    //   const originalMenuData = memoizeOneFormatter(routes, authority, path);
    //   const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);
    //   yield put({
    //     type: 'save',
    //     payload: { menuData, breadcrumbNameMap, routerData: routes },
    //   });
    // },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
