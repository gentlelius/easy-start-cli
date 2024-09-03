import { Input, Select, Space } from 'antd';
import React, { useState, useCallback } from 'react';

const { Search } = Input;

type Option = {
	label: string;
	value: string;
};

type Value = {
	name: string;
	value: string;
};

type PropsType = {
	disabled?: boolean;
	value: Value;
	onChange: (e: Value) => void;
	options: Option[];
	defaultOption: Option;
	placeholder?: string;
	enterButton?: string;
	eventName?: string;
	style?: object;
};

const Widget: React.FC<PropsType> = (props) => {
	const { eventName, style, placeholder, enterButton, value, options, onChange } = props;

	const handleSelectChange = (e) => {
		onChange({
			name: e,
			value: value.value,
		});
	};

	const [loading, setLoaing] = useState(false);

	const handleChange = useCallback((e) => {
		onChange(e);
	}, []);

	const handleSearch = useCallback((e) => {
		setLoaing(true);
		document.dispatchEvent(new CustomEvent(eventName || 'idSearch', { detail: e }));
		setTimeout(() => {
			setLoaing(false);
		}, 1e3);
	}, []);

	return (
		<Space.Compact>
			<Select
				style={{ width: 130 }}
				options={options}
				defaultValue={value.name}
				onChange={handleSelectChange}
			/>
			<Search
				style={style}
				enterButton={enterButton}
				placeholder={placeholder}
				value={value.value}
				onChange={handleChange}
				onSearch={handleSearch}
				disabled={props.disabled}
				loading={loading}
			/>
		</Space.Compact>
	);
};

export default Widget;
