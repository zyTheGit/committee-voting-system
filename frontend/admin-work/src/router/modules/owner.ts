import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { TableOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/owner',
    name: 'Owner',
    redirect: '/owner/basic-list',
    component: Layout,
    meta: {
      title: '业主管理',
      icon: renderIcon(TableOutlined),
      sort: 2,
    },
    children: [
      {
        path: 'basic-list',
        name: 'basic-list',
        meta: {
          title: '业主管理',
        },
        component: () => import('@/views/owner/basicList/index.vue'),
      },
      {
        path: 'basic-info/:id?',
        name: 'basic-info',
        meta: {
          title: '基础详情',
          hidden: true,
          activeMenu: 'basic-list',
        },
        component: () => import('@/views/owner/basicList/info.vue'),
      },
    ],
  },
];

export default routes;
