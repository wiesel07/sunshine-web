import { stringify } from 'qs';
import request from '@/utils/request';
import { baseUrl} from '@/services/apiConstant';

// 获取mock的菜单数据
export async function getMockMenuData() {
    return  request('/getMockMenuData');
 
}

export async function getMenuTree() {
    return  request(`${baseUrl}/system/menu/tree`);
}




// export async function remove(params) {
//     return request(`/smart-web/system/role/delete?${stringify(params)}`);
//   }