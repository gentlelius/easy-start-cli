import CompressionPlugin from 'compression-webpack-plugin';
import path from 'path';
import { defineConfig } from 'umi';
import { getConfig } from './libs/env';
import proxy from './libs/proxy';
import routes from './libs/routes';

const UMI_ENV = process.env.UMI_ENV;

// 公共配置
export default defineConfig({
	npmClient: 'yarn',
	hash: true,
	fastRefresh: true,
	routes,
	mfsu: false,
	esbuildMinifyIIFE: true,
	plugins: [path.resolve(__dirname, './plugin-log.ts')],
	mock: {
		include: ['src/pages/**/mock.ts'],
	},
	// 开启antd组件 https://umijs.org/docs/max/antd
	antd: {
		import: false,
	},
	// 开启请求 https://umijs.org/docs/max/request
	request: {},
	// 数据流 https://umijs.org/docs/max/data-flow
	model: {},
	// 全局初始状态 https://umijs.org/docs/max/data-flow
	initialState: {},
	// 子应用配置 https://umijs.org/docs/max/micro-frontend
	qiankun: {
		slave: {},
	},
	// 国际化 https://umijs.org/docs/max/i18n
	locale: {
		antd: true,
		baseNavigator: false,
		baseSeparator: '-',
		default: 'zh-CN',
	},
	chainWebpack: (config) => {
		config.when(UMI_ENV === 'production', (c: any) =>
			c.config.plugin('compression-webpack').use(CompressionPlugin, [
				{
					deleteOriginalAssets: false,
					algorithm: 'gzip',
					test: /\.(js)|(css)(\?.*)?$/i,
				},
			])
		);
	},
	proxy: proxy,
	jsMinifierOptions: {
		pure: ['console.log'],
	},
  layout: {
    title: '%%projectName%%',
    locale: false,
  },
	...getConfig(),
});
