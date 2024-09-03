import { MaskPage } from '../constant';

/**
 * 路由配置
 * @rule 路由路径规则：全小写+横杠（-）
 */
export default [
	{
		path: '/',
		component: '@/pages/home/index',
	},
	{
		path: '/home',
		component: '@/pages/home/index',
    name: '首页',
	},
  {
    path: '/mask',
    name: '模板管理',
    routes: [
      {
        path: '/mask', // 当访问 /mask 时
        exact: true,
        redirect: '/mask/list', // 重定向到 /mask/list
      },
      {
        path: '/mask/list',
        component: '@/pages/mask/list',
        name: MaskPage.list,
      },
    ]
  }
];
