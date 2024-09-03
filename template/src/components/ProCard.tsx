import { ProCard } from '@ant-design/pro-components';

interface IProps {
	title: React.ReactNode;
	extra?: React.ReactNode;
	children: React.ReactNode;
}
export default (props: IProps) => {
	return (
		<ProCard
			title={props.title}
			bordered
			headerBordered
			gutter={16}
			extra={props.extra}
			style={{ marginBottom: '20px' }}>
			{props.children}
		</ProCard>
	);
};
