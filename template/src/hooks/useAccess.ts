import { useModel } from '@umijs/max';

const useAccess = (id: string) => {
	const model = useModel('@@initialState');
	const accessData = model.initialState?.accessData;
	return [Array.isArray(accessData) ? accessData.includes(id) : false, accessData];
};

export default useAccess;
