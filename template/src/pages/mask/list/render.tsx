import { Card } from 'antd';
import EasyRender from 'react-easy-render';

interface EasyProps {
	schema: object;
	actionsHandler?: Function[];
	navsHandler?: Function[];
}

const Render = (props: EasyProps) => {
	const { schema } = props;

	return (
		<Card>
			<EasyRender
				schema={schema}
				actionsHandler={props.actionsHandler}
				navsHandler={props.navsHandler}
			/>
		</Card>
	);
};

export default Render;
