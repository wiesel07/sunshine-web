import { stringify } from 'qs';
import request from '@/utils/request';
import { baseUrl} from '@/services/apiConstant';

export async function queryPage(params) {
  return request(`${baseUrl}/system/sysDict/pages?${stringify(params)}`);
}

export async function remove(params) {
  return request(`${baseUrl}/system/sysDict/delete?${stringify(params)}`);
}