import { formatDate, mulDecimal } from '@/utils';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { ProConfigProvider } from '@ant-design/pro-components';
import { FC, ReactNode } from 'react';
import AutoSearch from '@/components/AutoSearch';

interface propsType {
	children?: ReactNode | ReactNode[];
	toThousandthNumOption?: Intl.NumberFormatOptions;
	decimalOption?: Intl.NumberFormatOptions;
}
export type customProvideTypes = 'weekDay' | 'percent' | 'toThousandthNum' | 'decimal' | 'link';
// 全局自定义valueType渲染类型
const CustomTableProvider: FC<propsType> = (props: propsType) => {
	return (
		<ProConfigProvider
			valueTypeMap={{
				// 日期格式化为星期几
				weekDay: {
					render(text) {
						return <span>{formatDate(text, 'dddd')}</span>;
					},
				},
				percent: {
					render(text: number) {
						return <span>{mulDecimal(text, 100)}%</span>;
					},
				},
				// 转千分位数字
				toThousandthNum: {
					render(text: number | null, compProps) {
						return (
							<span>
								{(text || 0).toLocaleString(
									'zh-CN',
									compProps.fieldProps.toThousandthNumOption ||
										props.toThousandthNumOption || { minimumFractionDigits: 2 },
								)}
							</span>
						);
					},
				},
				decimal: {
					render(text: number) {
						return (
							<span>
								{text.toLocaleString('zh', {
									style: 'decimal',
									...(props.decimalOption || { minimumFractionDigits: 2 }),
								})}
							</span>
						);
					},
				},
				// 转链接
				link: {
					render(text, props) {
						// @ts-ignore
						const href = props.fieldProps.getLink?.(props.record);
						return (
							<a href={href} target='_blank' rel='noopener noreferrer'>
								{text}
							</a>
						);
					},
				},
				// √和×的渲染
				flag: {
					render(text, props) {
						// @ts-ignore
						const value = props.fieldProps.flagValues;
						const options = {
							[value?.trueValue || 1]: <CheckOutlined />,
							[value?.falseValue || 0]: <CloseOutlined />,
						};
						return options[text] || '-';
					},
				},
				// html字符串渲染
				html: {
					render(text) {
						return <div dangerouslySetInnerHTML={{ __html: `<div>${text}</div>` }}></div>;
					},
				},
				// 自动搜索
				autoSearch: {
					renderFormItem(text, props) {
						let key: string = '';
						if (typeof props.proFieldKey === 'string') {
							key = props.proFieldKey;
						}
						return (
							<AutoSearch
								label={props.label}
								name={key.replace('table-field-', '')}
								requestMethod={props.fieldProps.searchName}
								noStyle
							/>
						);
					},
					render(text) {
						return <span>{text}</span>;
					},
				},
			}}>
			{props.children}
		</ProConfigProvider>
	);
};

export default CustomTableProvider;
