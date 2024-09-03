import { useCallback, useEffect, useRef } from 'react';

const useAsync = () => {
	const store = useRef<Record<string, any>>({});
	const eventRef = useRef<any>({});
	const timeRef = useRef<any>();
	const setQueue = useRef<Function[]>([]);

	const flushQueue = useCallback(() => {
		clearTimeout(timeRef.current);
		timeRef.current = setTimeout(() => {
			setQueue.current.forEach((fn) => fn());
			setQueue.current = [];
		});
	}, []);

	const asyncSet = (key: string, value: any) => {
		setQueue.current.push(() => {
			store.current[key] = value;
			document.dispatchEvent(new Event(key));
		});
		flushQueue();
	};

	const asyncGet = (key: string) => {
		if (store.current[key] === undefined) {
			return new Promise((resolve) => {
				eventRef.current[key] = () => {
					resolve(store.current[key]);
				};
				document.addEventListener(key, eventRef.current[key]);
			});
		}
		return Promise.resolve(store.current[key]);
	};

	const destroy = () => {
		clearTimeout(timeRef.current);
		Object.keys(store.current).forEach((key) => {
			document.removeEventListener(key, eventRef.current[key]);
		});
		store.current = {};
		eventRef.current = {};
		setQueue.current = [];
	};

	useEffect(() => {
		return destroy;
	}, []);

	return {
		asyncGet,
		asyncSet,
		asyncDestroy: destroy,
	};
};

export default useAsync;
