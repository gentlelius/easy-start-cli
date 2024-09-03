import { IApi } from 'umi';
import { getBranchName, getCommitHash, getErVersion, getWebVersion } from './version';

export default (api: IApi) => {
	api.describe({
		key: 'appendJsLog',
		config: {
			schema(joi) {
				return joi.string();
			},
		},
		// enableBy: api.EnableBy.config
	});
	api.addEntryCode(() => `console.info('%c 当前版本为： ${getWebVersion()}', 'font-size: 30px');`);
	api.addEntryCode(
		() =>
			`console.info('%c 当前分支为： ${getBranchName()}，commit 为：${getCommitHash()}', 'font-size: 30px');`
	);
	api.addEntryCode(() => `console.info('当前 er 版本： ${getErVersion()}')`);
	api.addHTMLScripts(() => [
		{
			content: '',
			id: 'webVersion',
			value: getWebVersion(),
		},
	]);
};
