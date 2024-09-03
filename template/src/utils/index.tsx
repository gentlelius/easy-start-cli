// 公共方法
import { notification } from 'antd';
import dayjs from 'dayjs';
import { Decimal } from 'decimal.js';
import { isNil } from 'lodash-es';
import queryString, { StringifyOptions } from 'query-string';
import type { DefaultOptionType } from 'rc-tree-select/lib/TreeSelect';

type TreeData = Record<string, any>;
/**
 * a标签下载
 * @param url string 下载的链接
 * @param fileName string 下载的名称
 */
export function downloadFile(url: string, fileName: string, type = 'application/vnd.ms-excel') {
	return new Promise((resolve, reject) => {
		if (!url) {
			reject('未传入url');
		}
		notification.open({
			message: '下载',
			description: `正在下载<${fileName}>文件,请耐心等候!`,
			duration: 3,
		});
		// 不同源时，设置下载的文件名
		const x = new window.XMLHttpRequest();
		x.withCredentials = true;
		x.open('GET', url, true);
		x.responseType = 'blob';
		x.onload = () => {
			let blob = new Blob([x.response], { type });
			const href = window.URL.createObjectURL(blob);
			// 创建a标签
			const a = document.createElement('a');
			// 设置下载文件url
			a.href = href;
			// 设置下载文件的文件名
			a.download = fileName;
			// 设置点击事件
			a.click();
			resolve({
				href,
				fileName,
			});
		};
		x.send();
	});
}

/**
 * 数组转树方法
 * @param arr{TreeData[]} - 传入的数组
 * @param [idKey]{string} - 父级id字段,默认值为id
 * @param [pidKey]{string} - 子级id字段,默认值为pId
 * @param [callback]{function(item: DefaultOptionType, [parent]: DefaultOptionType):DefaultOptionType} - 子级id字段,默认值为pId
 * @returns {TreeData[]}
 */
export function tranListToTreeData(
	arr: TreeData[],
	idKey: string = 'id',
	pidKey: string = 'pId',
	callback?: (item: DefaultOptionType, parent?: DefaultOptionType) => DefaultOptionType,
): DefaultOptionType[] {
	const newArr: TreeData[] = [];
	if (!Array.isArray(arr)) {
		console.error('传入值必须为数组');
		return newArr;
	}
	// 1. 构建一个字典：能够快速根据id找到对象。
	const map: Record<string, TreeData> = {};
	arr.forEach((item) => {
		// 为了计算方便，统一添加children
		item.children = [];
		// 默认所有节点为叶子节点
		item.isLeaf = true;
		// 构建一个字典
		const key = item[idKey];
		map[key] = item;
	});

	// 2. 对于arr中的每一项根据父级id查找对应的从属关系
	arr.forEach((item) => {
		const parent = map[item[pidKey]];
		if (parent) {
			// 当确认为父级元素时,将叶子节点标记变为false
			parent.isLeaf = false;
			// 如果它有父级,把当前对象添加父级元素的children中
			parent.children.push(callback ? callback(item, parent) : item);
		} else {
			// 如果它没有父级(pid:''),直接添加到newArr
			newArr.push(callback ? callback(item) : item);
		}
	});

	return newArr;
}

/**
 * 获取数据类型
 * @param data{unknown} 传入的数据
 */
function getType(data: unknown): string {
	return Object.prototype.toString.call(data);
}

/**
 * 判断是否为对象类型
 * @param data{unknown} 传入的数据
 */
export function isObject(data: unknown): boolean {
	return getType(data) === '[object Object]';
}

/**
 * @description 带小数的千位分隔符格式转换
 * @param {string | number} num 带转化参数
 * @param {number} digit 保留位数
 *
 * @return 始终带设定小数位的格式化字符串
 */
export function digitToLocaleString(num: string | number, digit: number): string {
	if (!['string', 'number'].includes(typeof num)) return '';

	const n = new Decimal(Number(num)).toFixed(digit, Decimal.ROUND_HALF_UP);
	const arr = n.split('.');
	const res = String(Number(arr[0]).toLocaleString());
	return res + '.' + arr[1];
}

export function divDecimal(a: number, b: number) {
	return new Decimal(a).div(new Decimal(b)).toNumber();
}

export function exportFile(res: any, fileName: string) {
	const url = window.URL.createObjectURL(new Blob([res]));
	const link = document.createElement('a');
	link.href = url;
	link.setAttribute('download', fileName);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
export function isEmpty(data: any) {
	return data === undefined || data === null || data === '';
}

/**
 * 数组根据任意字段分组
 * @param list
 * @param groupMethod
 * @return {any[] | Record<string, Record<string, any>[]>}
 */
export function groupBy(
	list: Record<string, any>[],
	groupMethod: (item: Record<string, any>) => string,
) {
	if (!Array.isArray(list)) {
		console.error('传入值必须为数组');
		return [];
	}
	const map: Record<string, Record<string, any>[]> = {};
	list.forEach((tmp) => {
		map[groupMethod(tmp)] = map[groupMethod(tmp)] || [];
		map[groupMethod(tmp)].push(tmp);
	});
	return map;
}

/**
 * 对象参数转Form Data字符串
 * @param obj{Record<string, any>}
 * @param [opt]{StringifyOptions}
 * @return {string}
 */
export function objectToFormData(obj: Record<string, any>, opt?: StringifyOptions): string {
	if (!isObject(obj)) {
		console.error('传入的参数不是一个对象');
		return '';
	}
	return queryString.stringify(obj, opt);
}

export function isFinalEmpty(data: any) {
	return data === undefined || data === null;
}

/**
 * 日期格式
 * @time date (2022-12-23) 需要格式化的日期
 * @style string (YYYY-MM-DD HH:mm:ss) 格式化的日期样式
 */
export function formatDate(time: any = '', style: string = 'YYYY-MM-DD') {
	if (!time) {
		return dayjs().format(style);
	}
	const dd = new Date(time);
	return dayjs(dd).format(style);
}

/**
 * 乘法
 * @param args
 * @return {number}
 */
export function mulDecimal(...args: number[]) {
	let current = args[0];
	args.forEach((num, index) => {
		if (index + 1 < args.length) {
			current = new Decimal(num).mul(new Decimal(args[index + 1])).toNumber();
		}
	});
	return current;
}

export function getString(str) {
	if (isNil(str)) {
		return '';
	}
	return String(str);
}

export function transform(data) {
	if (isNil(data)) {
		return undefined;
	}
	if (typeof data !== 'object') {
		return data;
	}
	const newData = Object.create(null);
	Object.keys(data).forEach((key) => {
		if (data[key] === null) {
			newData[key] = undefined;
		} else if (data[key]?.value) {
			newData[key] = data[key].value;
		} else if (Array.isArray(data[key])) {
			newData[key] = data[key].map((item) => transform(item));
		} else if (typeof data[key] !== 'object') {
			newData[key] = data[key];
		} else if (typeof data[key] === 'object') {
			newData[key] = transform(data[key]);
		} else {
			console.error('数据格式错误', data[key]);
		}
	});
	return newData;
}

function diff(obj1, obj2) {
	const diffs = {};

	// Check all properties in obj1
	for (let prop in obj1) {
		if (obj1.hasOwnProperty(prop)) {
			// If the property is an object, recursively check its properties
			if (typeof obj1[prop] === 'object') {
				const nestedDiffs = diff(obj1[prop], obj2[prop]);
				if (Object.keys(nestedDiffs).length > 0) {
					diffs[prop] = nestedDiffs;
				}
			} else if (obj1?.[prop] !== obj2?.[prop]) {
				// If the property is not an object, compare its value to the corresponding property in obj2
				diffs[prop] = [obj1[prop], obj2[prop]];
			}
		}
	}

	// Check all properties in obj2 that were not already checked in obj1
	for (let prop in obj2) {
		if (obj2.hasOwnProperty(prop) && !obj1.hasOwnProperty(prop)) {
			// If the property is an object, recursively check its properties
			if (typeof obj2[prop] === 'object') {
				const nestedDiffs = diff(obj2[prop], obj1[prop]);
				if (Object.keys(nestedDiffs).length > 0) {
					diffs[prop] = nestedDiffs;
				}
			} else {
				// If the property is not an object, add it to the diffs object
				diffs[prop] = [undefined, obj2[prop]];
			}
		}
	}

	return diffs;
}

// 深比较两个对象不同的地方
export function diffArray(arr1, arr2) {
	const diffs: object[] = [];

	const maxLength = Math.min(arr1.length, arr2.length);
	let i;
	for (i = 0; i < maxLength; i++) {
		const result = diff(arr1[i], arr2[i]);
		diffs.push(result);
	}

	while (i < arr1.length) {
		diffs.push(arr1[i]);
		i++;
	}

	while (i < arr2.length) {
		diffs.push(arr2[i]);
		i++;
	}

	return diffs.map((item) =>
		Object.keys(item).every((key) => item[key] === undefined) ? {} : item,
	);
}

export function isZh(str) {
	const reg = /^[\u4e00-\u9fa5]+$/;
	return reg.test(str);
}

export function checkFileType(fileBlob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		const blobSlice = fileBlob.slice(0, 4);
		reader.readAsArrayBuffer(blobSlice);

		reader.onloadend = function (e) {
			if (e.target?.readyState === FileReader.DONE) {
				const arr = new Uint8Array(e.target.result as ArrayBuffer);
				let header = '';
				for (let i = 0; i < arr.length; i++) {
					header += arr[i].toString(16).padStart(2, '0');
				}
				if (header.startsWith('25504446')) {
					resolve('pdf');
				} else if (
					header.startsWith('504b0304') ||
					header.startsWith('504b0506') ||
					header.startsWith('504b0708')
				) {
					resolve('xlsx');
				} else if (header.startsWith('d0cf11e0')) {
					resolve('xls');
				} else {
					reject('Unknown file type');
				}
			}
		};

		reader.onerror = function () {
			reject('Error reading file');
		};
	});
}

export function sumDecimal(arr) {
	return Array.isArray(arr)
		? arr
				.filter((item) => !!item)
				.reduce((acc, num) => acc.plus(new Decimal(num)), new Decimal(0))
				.toString()
		: 0;
}

// 定义一个函数用于下载文件
function downloadPdfOrExcel(res, name, fileType) {
	notification.open({
		message: '下载',
		description: `正在下载文件，请耐心等候!`,
		duration: 3,
	});

	let mimeType;
	let extension;

	if (fileType === 'pdf') {
		mimeType = 'application/pdf';
		extension = '.pdf';
	} else {
		// 默认为 excel
		mimeType = 'application/vnd.ms-excel';
		extension = fileType || '.xlsx';
	}

	const blob = new Blob([res], { type: mimeType });
	const link = document.createElement('a');
	link.href = window.URL.createObjectURL(blob);
	link.download = `${name}${extension}`;
	link.click();
}

export function filePipe(callback: () => Promise<any>, name) {
	return callback()
		.then((responseBlob) => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsText(responseBlob);
				reader.onload = () => {
					try {
						// 尝试解析为JSON
						const result = JSON.parse(reader.result as string);
						resolve(result);
						console.log('解析为JSON成功:', result);
					} catch (e) {
						// 解析JSON失败，按照blob处理
						console.log('数据不是JSON，按照blob处理');
						// 这里处理blob数据
						resolve(responseBlob);
					}
				};
				reader.onerror = (e) => {
					console.error('文件读取出错:', e);
					reject(e);
				};
			});
		})
		.then(async (res) => {
			if (res instanceof Blob) {
				const fileType = await checkFileType(res);

				// 使用函数进行下载
				if (fileType === 'pdf' || fileType === 'xls' || fileType === 'xlsx') {
					downloadPdfOrExcel(res, name, fileType);
				}
			} else if (typeof res === 'object') {
				return Promise.reject((res as any)?.code ?? '解析失败');
			}
		});
}

export function getFilename(contentDisposition) {
	const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
	const matches = filenameRegex.exec(contentDisposition);
	if (matches !== null && matches !== undefined && matches[1]) {
		// 去除引号
		return matches[1].replace(/['"]/g, '');
	}
	return null;
}
