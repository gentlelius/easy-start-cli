// 运行时配置文件
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { message, notification } from 'antd';
import { startsWith } from 'lodash-es';
import { setBaseUrl, setResponseInterceptor } from 'react-easy-render';

const resInterceptor = (response) => {
	const result = response.data;
	// 兼容不规范的接口
	if (result.success !== false) {
		result.success = true;
	}
	// 如果接口返回的数据中，success 为 true 时，不弹出错误提示，但当返回的数据为文件类型或请求时携带了 resolveError 参数时，不弹出错误提示
	if (result.success === false && !response.config.resolveError) {
		notification.warning({
			message: result.message,
			description: result.data,
		});
		return Promise.reject(result);
	}

	// 请求方式为 POST 时，如果接口返回的数据中，success 为 true 时，弹出成功提示
	if (result.success === true && result.message && response.config.method === 'post') {
		message.success(result.message);
	}
	return response;
};

const errInterceptor = (error) => {
	const reqId = error.response.headers['x-request-id'];
	notification.error({
		message: '不要着急，请联系开发同事协助处理～',
		description: (
			<div>
				错误代码：{reqId}{' '}
				<a
					onClick={() => {
						const input = document.createElement('input');
						input.value = reqId;
						document.body.appendChild(input);
						input.select();
						document.execCommand('copy');
						document.body.removeChild(input);
						notification.success({ message: '复制成功' });
					}}>
					复制
				</a>
			</div>
		),
	});
	console.log(
		'%c 异常详情：' + error.response.data.data?.error,
		'color: #3498db; font-size: 18px; font-weight: bold;',
	);
	console.log(
		'%c 位置：' + error.response.data.data?.position,
		'color: #3498db; font-size: 18px; font-weight: bold;',
	);
	return Promise.reject(error);
};

setBaseUrl(BASE_URL);

const pickDataBy = (callback) => (res) => callback(res).data;
setResponseInterceptor(pickDataBy(resInterceptor), errInterceptor);

let authList: string[] = [];
// 与后端约定的响应数据格式

// 配置请求
export const request: RequestConfig = {
	// 超时配置
	timeout: 60000,
	// 携带Cookies
	withCredentials: true,
	// 错误配置
	errorConfig: {
		// 错误捕获
		errorHandler(error: any) {
			console.log('error', error);
		},
	},
	// 请求拦截器
	requestInterceptors: [
		[
			(config: { url: string }) => {
				return {
					...config,
					url: startsWith(config.url, '//') ? config.url : `${BASE_URL}${config.url}`,
					// getResponse: true,
				};
			},
		],
	],
	// 响应拦截器
	responseInterceptors: [[resInterceptor, errInterceptor]],
};

// 路由拦截
export function onRouteChange(opt: {
	routes: Record<string, any>;
	location: Record<string, any>;
	basename: string;
}) {
	// if (!process.env.UMI_ENV) {
	// 	return;
	// }

	let current: Record<string, any> = {};
	Object.keys(opt.routes).forEach((key) => {
		if (opt.location.pathname.replace(opt.basename, '') === opt.routes[key].path) {
			current = opt.routes[key];
		}
	});

	// 设置页面标题
	document.title = current.meta?.title || 'MSG';

	if (current.meta?.auth && !authList.includes(current.meta?.auth)) {
		history.replace('/');
	}
}

// src/app.ts
export async function getInitialState() {
	// const res = await req('/system/rest/permission/queryUserPermCodes?systemIds=2');
	// if (res.success) {
	// 	authList = res.data;
	// 	return {
	// 		accessData: authList,
	// 	};
	// }
	return {};
}

export const layout: RunTimeLayoutConfig = () => {
	return {
		menuRender: (props, defaultDom) => {
			return APP_ENV === 'dev' ? defaultDom : null;
		},
		// 其他属性见：https://procomponents.ant.design/components/layout#prolayout
	};
};
