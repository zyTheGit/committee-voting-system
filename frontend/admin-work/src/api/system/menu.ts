import { Alova } from '@/utils/http/alova/index';
export interface ListDate {
  label: string;
  key: string;
  type: number;
  subtitle: string;
  openType: number;
  auth: string;
  path: string;
  children?: ListDate[];
}

const menusList = [
 
];

/**
 * @description: 根据用户id获取用户菜单
 */
export function adminMenus() {
  // return Alova.Get('/menus');

  return Promise.resolve(menusList);
}

/**
 * 获取tree菜单列表
 * @param params
 */
export function getMenuList(params?) {
  return Promise.resolve(menusList);
  // return Alova.Get<{ list: ListDate[] }>('/menu/list', {
  //   params,
  // });
}
