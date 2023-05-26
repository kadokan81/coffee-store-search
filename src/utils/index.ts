export const isEmpty = (obj: {}) => {
	return obj && Object.keys(obj).length === 0;
};

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
