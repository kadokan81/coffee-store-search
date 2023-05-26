import { CoffeeShopsMainResponse } from '@/typesFolder';

import { createApi } from 'unsplash-js';

//@ts-ignore
const unsplashApi = createApi({
	accessKey: process.env.NEXT_PUBLIC_UNSPLASH_API_KEY,
});

// 55.70604589332291, 9.532440653437025
//amsterdam 52.37168118823912, 4.883373050395192
// New  York 40.73810050687363, -73.98825203756041

// const getUrlForCoffeeStores = (
// 	latLong: string,
// 	query: string,
// 	limit: number
// ) => {
// 	return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
// };

const getListOfCoffeeStorePhotos = async () => {
	const photos = await unsplashApi.search.getPhotos({
		query: 'coffee shop',
		perPage: 10,
		orientation: 'landscape',
	});
	const unsplashResults = photos.response?.results || [];

	return unsplashResults.map((result) => result.urls['small']);
};

export async function fetchCoffeeStores(
	latLong = '43.6538,-79.3789',
	limit = 6
) {
	const photos = await getListOfCoffeeStorePhotos();

	try {
		const searchParams = new URLSearchParams({
			query: 'coffee',
			// ll: '40.7381,-73.9882',
			ll: latLong,
			open_now: 'true',
			sort: 'DISTANCE',
			limit: limit.toString(),
		});
		const results = await fetch(
			`https://api.foursquare.com/v3/places/search?${searchParams}`,
			{
				method: 'GET',
				// @ts-ignore
				headers: {
					Accept: 'application/json',
					Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
				},
			}
		);
		const data = (await results.json()) as CoffeeShopsMainResponse;

		return data.results.map((res, ind) => {
			return {
				...res,
				imgUrl: photos.length
					? photos[ind]
					: 'https://plus.unsplash.com/premium_photo-1675716443562-b771d72a3da7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
			};
		});
	} catch (err) {
		console.error(err);
	}
}
