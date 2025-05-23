import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { TableOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/owner',
    name: 'Owner',
    redirect: '/owner/owner-list',
    component: Layout,
    meta: {
      title: '业主管理',
      icon: renderIcon(TableOutlined),
      sort: 1,
    },
    children: [
      {
        path: 'owner-list',
        name: 'owner-list',
        meta: {
          title: '业主管理',
        },
        component: () => import('@/views/owner/index.vue'),
      },
      // {
      //   path: 'owner-basic-info/:id?',
      //   name: 'owner-basic-info',
      //   meta: {
      //     title: '基础详情',
      //     hidden: true,
      //     activeMenu: 'basic-list',
      //   },
      //   component: () => import('@/views/owner/basicList/info.vue'),
      // },
    ],
  },
];

export default routes;
