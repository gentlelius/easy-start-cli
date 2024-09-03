// import React from 'react';
// import { Modal } from 'antd';
// import { request } from '@umijs/max';
// import Edit from './edit';
// import { getValue, setValueOnce } from 'react-easy-render';

import { history } from '@umijs/max';

export default [
	(record) => {
		history.push(`/mask/detail/${record.id}`);
	},
	(record) => {
		history.push(`/mask/review/${record.id}`);
	},

	(record) => {
		history.push(`/mask/edit/${record.id}`);
	},
];
