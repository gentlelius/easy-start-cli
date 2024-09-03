import { Input, Select, Space } from 'antd';
import React, { useEffect } from 'react';

type Option = {
	label: string;
	value: string;
};

type Value = {
	name?: string;
	value?: string;
};

type PropsType = {
	disabled?: boolean;
	value: Value;
	onChange: (e: Value) => void;
	options: Option[];
	defaultOption: Option;
};

const Widget: React.FC<PropsType> = (props) => {
	const { options, value = {}, onChange } = props;

	const handleInputChange = (e) => {
		onChange({
			name: value.name,
			value: e.target.value,
		});
	};

	const handleSelectChange = (e) => {
		onChange({
			name: e,
			value: value.value,
		});
	};

	useEffect(() => {
		onChange({});
	}, []);

	return (
		<Space.Compact>
			<Select
				style={{ width: 130 }}
				options={options}
				value={value.name}
				onChange={handleSelectChange}
			/>
			<Input value={value.value} onChange={handleInputChange} allowClear />
		</Space.Compact>
	);
};

export default Widget;
