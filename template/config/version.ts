import { execSync } from 'child_process';
import path from 'path';

const projectDirName = path.resolve(__dirname, '../');

export const getBranchName = () => {
	let branchName = 'empty-branch';
	try {
		branchName = execSync('git symbolic-ref --short HEAD', {
			cwd: projectDirName,
			encoding: 'utf8',
		});

		branchName = branchName.replace(/\n/gi, '');
		branchName = branchName.replace(/\s/gi, '');
	} catch (err) {}

	return branchName;
};

export const getCommitHash = () => {
	try {
		return execSync('git rev-parse --short HEAD', { cwd: projectDirName, encoding: 'utf8' }).trim();
	} catch (err) {}

	return '';
};

/**
 * 设置前端版本号
 */

export const getWebVersion = () => {
	function addZero(num: number) {
		if (num < 10) {
			return `0${num}`;
		}
		return num;
	}
	const date = new Date();
	return `${date.getFullYear()}${addZero(date.getMonth() + 1)}${addZero(date.getDate())}-${addZero(
		date.getHours()
	)}${addZero(date.getMinutes())}`;
};

export const getErVersion = () => {
	// 获取 node_modules 里面的包的版本
	try {
		const dir = path.resolve(__dirname, '../node_modules/react-easy-render');
		const packageJson = require(path.resolve(dir, 'package.json'));
		return packageJson.version;
	} catch (error) {
		return '没有获取到版本号';
	}
};
