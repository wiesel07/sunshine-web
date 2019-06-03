import { stringify } from 'qs';
import request from '@/utils/request';


export async function queryPage(params) {
    return request(`/smart-web/system/role/pages?${stringify(params)}`);
  }