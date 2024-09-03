// 导出
import { request } from '@umijs/max';
import { message, Modal, Progress } from 'antd';
import React, { useEffect, useState } from 'react';

// 传参
interface propsType {
	progressTitle?: string; // 传参key值
	progressKey: string; // 获取进度的key
	handleOk: any; // 下载方法
	handleClose: any; // 取消下载方法
	useDownload?: boolean; // 是否需要在进度完成后进行下载
	requestURL?: string; // 接口地址
	unDownload?: boolean;
	title?: string;
	downloadURL?: string; // 下载链接
}

// 停止定时器的标识
let stopFlag = false;

// 下载链接
const baseUrl = `${BASE_URL}/excel/download?path=`;

const ExportProgress: React.FC<propsType> = (props) => {
	const [percentage, setPercentage] = useState(0);
	const [downloadUrl, setDownloadUrl] = useState('');
	const [fileName, setFileName] = useState('demo');

	// 循环调用下载接口
	const foreachGetProgress = (progress: any, api: any) => {
		return new Promise((resolve) => {
			request(props.requestURL || '/fund/progress-bar/v2/queryResult', {
				method: 'GET',
				params: {
					[props.progressTitle || 'progressKey']: progress,
				},
			}).then((res) => {
				const percent = res.data?.percentage || res?.process;
				if (percent === 100 && (res.data?.success || res?.success)) {
					clearInterval(api);
					if (!props.unDownload) {
						setDownloadUrl(
							`${props.downloadURL || baseUrl}${
								res.data?.attachments?.attachmentPath || res?.attachPath
							}`,
						);
						setFileName(res.data?.attachments?.attachmentName || '下载文件');
					}
					setPercentage(100);
				} else {
					if (res.data?.errorMsg) {
						clearInterval(api);
						message.error(res.data?.errorMsg);
						props.handleClose();
					} else {
						if (percent) {
							setPercentage(percent);
						} else {
							setPercentage((prevPercentage) => {
								return prevPercentage + 1;
							});
						}
					}
				}
				resolve(true);
			});
		});
	};

	// 设置定时器
	const handleSetInterval = (key: string) => {
		let f = true;
		stopFlag = false;
		let api: any = setInterval(async () => {
			if (stopFlag) {
				clearInterval(api);
				api = null;
			} else {
				if (f) {
					f = false;
					await foreachGetProgress(key, api);
					f = true;
				}
			}
		}, 1000);
	};

	useEffect(() => {
		handleSetInterval(props.progressKey);
	}, [props.progressKey]);

	// 确定
	const printFile = () => {
		console.log('downloadUrl', downloadUrl);
		if (props.useDownload || !props.unDownload) {
			if (percentage !== 100) {
				message.info('请耐心等待!');
				return;
			}
			stopFlag = true;
			props.handleOk('export', { url: downloadUrl, fileName });
		} else {
			props.handleOk?.(percentage);
		}
	};

	// 取消
	const printCancel = () => {
		stopFlag = true;
		props.handleClose();
	};

	return (
		<Modal
			title={props.title || '导出'}
			open={true}
			closable={false}
			onCancel={printCancel}
			confirmLoading={percentage !== 100}
			maskClosable={false}
			onOk={printFile}>
			<span>进度条到100%时，可点击确定按钮进行下载！</span>
			<Progress
				percent={percentage}
				strokeColor='#40a9ff'
				format={(percent) => `${percent}%`}
				strokeWidth={15}
				status='normal'
			/>
		</Modal>
	);
};

export default ExportProgress;
