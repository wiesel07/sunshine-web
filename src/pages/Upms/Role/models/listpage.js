import { queryPage } from '@/services/upmsRole';
export default {
    namespace: 'Upms.Role',

    state: {
        gridData: [],
        pagination: {},
    },

    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(queryPage, payload);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        //   *add({ payload, callback }, { call, put }) {
        //     const response = yield call(addRule, payload);
        //     yield put({
        //       type: 'save',
        //       payload: response,
        //     });
        //     if (callback) callback();
        //   },
        //   *remove({ payload, callback }, { call, put }) {
        //     const response = yield call(removeRule, payload);
        //     yield put({
        //       type: 'save',
        //       payload: response,
        //     });
        //     if (callback) callback();
        //   },
        //   *update({ payload, callback }, { call, put }) {
        //     const response = yield call(updateRule, payload);
        //     yield put({
        //       type: 'save',
        //       payload: response,
        //     });
        //     if (callback) callback();
        //   },
        *remove({ payload }, { call, put }) {
            console.log("数据"+payload);
        },
    },

    reducers: {
        save(state, action) {
            debugger;
            return {
                ...state,
                gridData: action.payload.data,
            };
        },
    },
};
