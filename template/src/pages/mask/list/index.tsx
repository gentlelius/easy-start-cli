import React from 'react';
import schema from './schema.json';
import actionsHandler from './on-action';
import navsHandler from './on-nav';
import ERender from './render';
import { PageContainer } from '@ant-design/pro-components';

export default () => (
	<PageContainer>
		<ERender schema={schema} actionsHandler={actionsHandler} navsHandler={navsHandler} />
	</PageContainer>
);
