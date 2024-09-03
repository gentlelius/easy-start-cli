import { isError } from 'lodash-es';
import { useCallback, useState } from 'react';

type UseLoadingReturnType = {
	run: (callback: () => Promise<any>) => Promise<any>;
	loading: boolean;
	error: any;
};

/***
 * @description 包装异步函数，自动处理 loading 和 error
 * @param {*} 无
 * @return {*} {run, loading, error}
 * @example const {run, loading, error} = useLoading();
 */
export default (): UseLoadingReturnType => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<any>(null);

	const run = useCallback(async (callback: () => Promise<any>): Promise<any> => {
		setLoading(true);
		try {
			return await callback();
		} catch (error: any) {
			setError(error);
			if (isError(error)) {
				// message.error(error.toString());
				console.error(error.toString());
			}
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		run,
		loading,
		error,
	};
};
