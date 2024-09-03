import { request } from '@umijs/max';
import { notification } from 'antd';

export type PropsType = {
	value: {
		fileName: string;
		fileType: string;
		filePath: string;
		modulePath?: string;
	};
	disabled?: boolean;
};

export default (props: PropsType) => {
	if (!props.value) {
		return <span>-</span>;
	}

	const { modulePath, fileName, filePath, fileType } = props.value;

	const onClick = () => {
		notification.open({
			message: '下载',
			description: `正在下载文件,请耐心等候!`,
			duration: 3,
		});
		request('/sn/file/download', {
			method: 'post',
			data: {
				fileName,
				filePath,
				fileType,
				modulePath,
			},
			responseType: 'blob',
		}).then((res) => {
			console.log(res);
			const blob = new Blob([res], { type: fileType });
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = fileName;
			link.click();
		});
	};
	return <a onClick={onClick}>{props.value.fileName}</a>;
};
