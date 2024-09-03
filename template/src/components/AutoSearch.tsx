import {
	accountSnClientAccountSearch,
	searchListByClientId,
	underlyingQuery,
} from '@/api/modules/inquiry';
import { snCustodianList } from '@/pages/order/components/custodian';
import { snPublisherList } from '@/pages/order/components/publisher';
import { ProFormSelect } from '@ant-design/pro-components';
import type { ProFormSelectProps } from '@ant-design/pro-form/es/components/Select';
import type { SelectProps } from 'antd';
import { debounce, get } from 'lodash-es';
import { DefaultOptionType } from 'rc-select/lib/Select';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export interface AutoSearchInstance {
	searchMethod: (value?: string | null, exParams?: Record<string, any>) => void;
	clear: () => void;
}

interface RequestMethods {
	// 请求方法
	method: (...args: any[]) => Promise<any>;
	// 结果列表渲染函数
	searchResultRender: (record: any[]) => DefaultOptionType[];
	// 组件空值背景文字
	placeholder?: string;
	// 搜索词字段key
	valueKey: string;
	// 接收data字段key
	dataKey: string;
	// 条目数字段key
	sizeKey: string;
	// 条目数
	size: number;
}

// 利用函数对配置的key进行自动推导
function defineConfig<T extends string>(config: Record<T, RequestMethods>) {
	return config;
}
const requestMethods = defineConfig({
	// sn发行商搜索
	snPublisherList: {
		method: snPublisherList,
		searchResultRender(list) {
			return list.map((tmp: Record<string, any>) => {
				tmp.label = tmp.publisherCode;
				tmp.value = tmp.publisherCode;
				return tmp as DefaultOptionType;
			});
		},
		valueKey: 'publisherCode',
		dataKey: 'data.records',
		sizeKey: 'limit',
		size: 20,
		placeholder: '',
	},
	// sn托管商搜索
	snCustodianList: {
		method: snCustodianList,
		searchResultRender(list) {
			return list.map((tmp: Record<string, any>) => {
				tmp.label = tmp.custodianCode;
				tmp.value = tmp.custodianCode;
				return tmp as DefaultOptionType;
			});
		},
		valueKey: 'custodianCode',
		dataKey: 'data.records',
		sizeKey: 'limit',
		size: 20,
		placeholder: '',
	},
	// 标的市场搜索
	underlyingQuery: {
		method: underlyingQuery,
		searchResultRender(list) {
			return list.map((tmp: Record<string, any>) => {
				tmp.label = tmp.underlyingCode;
				tmp.value = tmp.underlyingCode;
				return tmp as DefaultOptionType;
			});
		},
		valueKey: 'securityCode',
		dataKey: 'data.list',
		sizeKey: 'limit',
		size: 20,
		placeholder: '',
	},
	// 华盛号搜索
	hsNoSearch: {
		method: accountSnClientAccountSearch,
		searchResultRender(list) {
			return list.map((tmp: Record<string, any>) => {
				tmp.label = tmp.hsNo;
				tmp.value = tmp.hsNo;
				return tmp as DefaultOptionType;
			});
		},
		valueKey: 'keyword',
		dataKey: 'data.list',
		sizeKey: 'limit',
		size: 20,
		placeholder: '',
	},
	// SN账号搜索
	SNAccountSearch: {
		method: searchListByClientId,
		// method: accountSnClientAccountSearch,
		searchResultRender(list) {
			return list.map((tmp: Record<string, any>) => {
				tmp.label = tmp.assetAccountId;
				tmp.value = tmp.assetAccountId;
				return tmp as DefaultOptionType;
			});
		},
		// valueKey: 'keyword',
		valueKey: 'clientId',
		dataKey: 'data.list',
		sizeKey: 'limit',
		size: 20,
		placeholder: '',
	},
	// SN/华盛号/资金账号搜索
	accountSnClientAccountSearch: {
		method: accountSnClientAccountSearch,
		searchResultRender(list) {
			return list.map((tmp: Record<string, any>) => {
				tmp.label = `华盛号:${tmp.hsNo}-SN账号:${tmp.assetAccountId}-资金账号:${tmp.moneyAccountId}-华盛ID:${tmp.hsId}`;
				tmp.value = tmp.assetAccountId;
				return tmp as DefaultOptionType;
			});
		},
		valueKey: 'keyword',
		dataKey: 'data.list',
		sizeKey: 'limit',
		size: 20,
		placeholder: '',
	},
});

// 远程自动搜索
interface KeywordsSearchProps
	extends Pick<
		ProFormSelectProps,
		'name' | 'label' | 'fieldProps' | 'placeholder' | 'rules' | 'readonly' | 'noStyle' | 'disabled'
	> {
	// 自定义结果列表渲染函数
	searchResultRender?: (list: Record<string, any>[]) => DefaultOptionType[];
	// 额外参数
	params?: Record<string, any>;
	// 请求方法名
	requestMethod: keyof typeof requestMethods;
	// 初始化查询
	useAutoSearch?: boolean;
	// 不限制无输入词查询
	useUnlimitedSearch?: boolean;
}

const KeywordsSearch = (props: KeywordsSearchProps, onRef: any) => {
	const [data, setData] = useState<SelectProps['options']>();
	const option = requestMethods[props.requestMethod];

	const searchMethod = async (value?: string | null, exParams?: Record<string, any>) => {
		if (!value && !props.useUnlimitedSearch) return;
		const api: RequestMethods['method'] = option?.method;
		if (!api) return console.error('请传入需要请求的方法名');
		let postData = {
			[option.valueKey]: value,
			[option.sizeKey]: option.size,
			size: 20,
			current: 1,
		};
		if (props.params) {
			postData = { ...postData, ...props.params };
		}
		if (exParams) {
			postData = { ...postData, ...exParams };
		}
		const res = await api(postData);
		if (!res.success) return;
		const d: any[] = get(res, option.dataKey, []);

		setData(props.searchResultRender ? props.searchResultRender(d) : option.searchResultRender(d));
	};
	const handleSearch = debounce(searchMethod, 350);
	useEffect(() => {
		if (props.useAutoSearch) {
			searchMethod();
		}
	}, []);

	useImperativeHandle(
		onRef,
		(): AutoSearchInstance => ({
			searchMethod,
			clear: () => {
				setData([]);
			},
		}),
		[props.name, props.requestMethod],
	);

	return (
		<ProFormSelect
			noStyle={props.noStyle}
			name={props.name}
			label={props.label}
			rules={props.rules}
			readonly={props.readonly}
			disabled={props.disabled}
			placeholder={props.placeholder || option?.placeholder}
			fieldProps={{
				getPopupContainer: (node) => node,
				onSearch: handleSearch,
				options: data,
				showSearch: true,
				onSelect: props.fieldProps?.onSelect,
				notFoundContent: props.placeholder || option?.placeholder,
			}}
		/>
	);
};

export default forwardRef(KeywordsSearch);
