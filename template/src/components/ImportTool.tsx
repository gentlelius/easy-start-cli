import { UploadOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';
import { notification, Alert, Button, message, Modal, Table, Upload } from 'antd';
import { ColumnType } from 'antd/es/table';
import { isNull, isNumber, isPlainObject } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';

enum StatusEnum {
	INIT = 1,
	PENDING = 2,
	SUCCESS = 3,
	FAIL = 4,
}

const statusMap = {
	[StatusEnum.INIT]: '初始化',
	[StatusEnum.PENDING]: '数据解析中',
	[StatusEnum.SUCCESS]: '数据解析完成',
	[StatusEnum.FAIL]: '数据解析失败',
};

const initStatus = StatusEnum.INIT;

const ErrorTag = 'error';

export type ImportPropsType = {
	onLoaded: (result: boolean) => void;
	loopUrl: string;
	uploadUrl: string;
	downloadUrl: string;
	downloadLabel: string;
	extra?: JSX.Element;
	showInfoTable?: boolean;
	infoColumn?: ColumnType<Record<string, any>>[];
};

const getPrettyData = (data: Record<string, any>) => {
	const getPrettyObj = (obj: Record<string, any>) => {
		const prettyObj = Object.fromEntries(
			Object.entries(obj).map(([key, value]) => {
				if (key === 'errorList' || key === 'errorMap') {
					return [key, value];
				}
				if (isNull(value)) {
					return [key, '-'];
				}
				if (isNumber(value)) {
					return [key, value.toString()];
				}
				if (isPlainObject(value)) {
					return [key, value.description ?? value.name ?? value.text ?? value.code ?? value.value];
				}
				return [key, value];
			}),
		);
		return prettyObj;
	};

	const allObjList = data.allObjList?.map((item: Record<string, any>) => getPrettyObj(item));
	return {
		...data,
		allObjList,
	};
};

const ImportItem = (props: ImportPropsType) => {
	const [updateKey, updateWidget] = useState(0);
	// 后端返回的数据结构有多种，一种为 record.errorList，另一种为 record.errorMap
	// 1. record.errorMap 为对象，对象的 key 为错误的字段名
	// 2. record.errorList 为数组，数组中的每一项为错误信息
	const infoColumn = useRef(props.infoColumn);
	infoColumn.current = infoColumn.current?.map((item: any) => ({
		render: (text, record) => {
			if (record.errorMap && Object.keys(record.errorMap).includes(item.dataIndex as string)) {
				return (
					<div style={{ color: 'red' }}>
						{record.errorMap[item.dataIndex] === ErrorTag
							? record[item.dataIndex]
							: record.errorMap[item.dataIndex] || '-'}
					</div>
				);
			}
			return text || '-';
		},
		...item,
	}));

	const [status, setStatus] = useState(initStatus);
	const [statusData, setStatusData] = useState<Record<string, any>>({});

	useEffect(() => {
		// 如果有错误信息，则显示错误信息
		const hasErrorList = statusData?.allObjList?.some(
			(item: Record<string, any>) => item.errorList?.length,
		);
		if (hasErrorList) {
			infoColumn.current?.unshift({
				title: '错误信息',
				dataIndex: 'errorList',
				render: (text: string[]) => {
					return (
						<div style={{ color: 'red' }}>
							{text.map((item) => (
								<div key={item}>{item}</div>
							))}
						</div>
					);
				},
			});
			updateWidget((i) => i + 1);
		}
	}, [statusData]);

	const loop = () => {
		let index = 0;
		const interval = setInterval(() => {
			index += 1;
			if (index > 2 * 60) {
				clearInterval(interval);
				message.error('文件解析超时，请稍后再试');
				setStatus(StatusEnum.FAIL);
				return;
			}
			request(props.loopUrl).then((res) => {
				if (res.success && res.data?.isDone) {
					const isOk = res.data?.failNum === 0;
					clearInterval(interval);
					if (res.data.errorMsg) {
						message.error('文件解析失败，请检查格式');
						setStatus(StatusEnum.FAIL);
					} else {
						// TODO:
						setStatus(isOk ? StatusEnum.SUCCESS : StatusEnum.FAIL);
						setStatusData(getPrettyData(res.data));
					}
					props.onLoaded(isOk);
				}
			});
		}, 1e3);
	};

	const uploadProps = {
		name: 'uploadFile',
		action: `${BASE_URL}${props.uploadUrl}`,
		withCredentials: true,
		onChange(info) {
			if (info.file.status !== 'uploading') {
				console.log(info.file, info.fileList);
			}
			if (info.file.status === 'done') {
				message.success('上传成功');
				setStatus(StatusEnum.PENDING);
				loop();
			} else if (info.file.status === 'error') {
				message.error(`${info.file.name} 上传失败。`);
			}
		},
	};

	const errNumInfo = statusData?.errorNumList?.length
		? `，解析失败编号：${statusData?.errorNumList.join(',')}`
		: '';

	const onDownloadClick = () => {
		notification.open({
			message: '下载',
			description: `正在下载文件,请耐心等候!`,
			duration: 3,
		});
		request(`${BASE_URL}${props.downloadUrl}`, {
			method: 'GET',
			responseType: 'blob',
		}).then((res) => {
			const blob = new Blob([res], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			});
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = props.downloadLabel;
			link.click();
		});
	};

	return (
		<>
			{status === initStatus ? (
				<div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
					<div>
						<span>模板下载：</span>
						<a onClick={onDownloadClick}>{props.downloadLabel}</a>
					</div>
					<div>
						<span style={{ fontWeight: 500, marginRight: 16 }}>Excel文件</span>
						<Upload {...uploadProps}>
							<Button icon={<UploadOutlined />}>点击上传</Button>
						</Upload>
						{props.extra}
					</div>
				</div>
			) : (
				<>
					{status === StatusEnum.PENDING ? (
						<Alert message='数据解析中，请稍后...' type='info' />
					) : (
						<Alert
							message={`${statusMap[status]}，数据总量：${statusData?.rowIndex}，解析成功数量：${statusData?.successNum}，解析失败数量：${statusData?.failNum}${errNumInfo}`}
							type={status === StatusEnum.SUCCESS ? 'success' : 'error'}
						/>
					)}
					{[StatusEnum.SUCCESS, StatusEnum.FAIL].includes(status) ? (
						<>
							{props.showInfoTable ? (
								<Table
									dataSource={statusData.allObjList}
									columns={infoColumn.current}
									pagination={false}
									scroll={{
										x: 'max-content',
									}}
									key={updateKey}
									rowKey={'index'}
								/>
							) : null}
						</>
					) : null}
				</>
			)}
		</>
	);
};
type ExclusiveFields =
	| { executeUrl: string; handleOk?: undefined }
	| { executeUrl?: undefined; handleOk: () => Promise<any> };

type ParamsType = Omit<ImportPropsType, 'onLoaded'> & {
	title?: string;
	onSuccess?: (e: any) => void;
	onError?: (e: any) => void;
} & ExclusiveFields;

export default (params: ParamsType) => {
	const modal = Modal.confirm({
		icon: null,
		title: params.title || '批量导入',
		content: (
			<ImportItem
				onLoaded={(isOk) => {
					modal.update({
						okButtonProps: {
							disabled: !isOk,
						},
					});
				}}
				downloadUrl={params.downloadUrl}
				uploadUrl={params.uploadUrl}
				loopUrl={params.loopUrl}
				downloadLabel={params.downloadLabel}
				extra={params.extra}
				showInfoTable={params.showInfoTable}
				infoColumn={params.infoColumn}
			/>
		),
		onOk: () => {
			if (params.handleOk) {
				return params.handleOk().then?.(params.onSuccess);
			}
			return request(params.executeUrl)
				.then((e) => {
					message.success('批量导入成功');
					params.onSuccess?.(e);
				})
				.catch(params.onError);
		},
		okText: '确认导入',
		width: params.showInfoTable ? 800 : 400,
		okButtonProps: {
			disabled: true,
		},
	});
};
