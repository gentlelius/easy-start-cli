import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import type { PropsType as DownloadPropsType } from '../download';
import Download from '../download';

const btnProps = {
	icon: <UploadOutlined />,
	children: '点击上传',
	style: {
		marginRight: 10,
	},
};

type ValueType = DownloadPropsType['value'];

export default function SnUpload(
	props: DownloadPropsType & { onChange: (val: ValueType) => void },
) {
	const uploadProps = {
		showUploadList: false,
		maxCount: 1,
		name: 'multipartFile',
		// data: {},
		action: `${BASE_URL}/sn/file/upload`,
		onChange(info) {
			if (info.file.status === 'done') {
				message.success(`${info.file.name} 上传成功`);
				console.log(info);
				props.onChange(info.file.response.data);
			} else if (info.file.status === 'error') {
				message.error(`${info.file.name} 上传失败`);
			}
		},
		onRemove() {
			props.onChange({
				...props.value,
			});
		},
		withCredentials: true,
		disabled: props.disabled,
	};

	return (
		<div className='sn-upload'>
			<Upload {...uploadProps}>
				<Button {...btnProps} disabled={props.disabled} />
			</Upload>
			<Download value={props.value} />
		</div>
	);
}
