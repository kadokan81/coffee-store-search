import { CoffeeShopsMainResponse } from '@/typesFolder';

import { createApi } from 'unsplash-js';

//@ts-ignore
const unsplashApi = createApi({
	accessKey: process.env.UNSPLASH_API_KEY,
});

// 55.70604589332291, 9.532440653437025
//amsterdam 52.37168118823912, 4.883373050395192
// New  York 40.73810050687363, -73.98825203756041

const getUrlForCoffeeStores = (
	latLong: string,
	query: string,
	limit: number
) => {
	return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
	const photos = await unsplashApi.search.getPhotos({
		query: 'coffee shop',
		perPage: 30,
	});
	const unsplashResults = photos.response?.results || [];

	return unsplashResults.map((result) => result.urls['small']);
};

export async function fetchCoffeeStores(
	latLong = '43.653833032607096%2C-79.37896808855945',
	limit = 6
) {
	const photos = await getListOfCoffeeStorePhotos();

	try {
		const searchParams = new URLSearchParams({
			query: 'coffee',
			ll: '40.7381,-73.9882',
			open_now: 'true',
			sort: 'DISTANCE',
			limit: '6',
		});
		const results = await fetch(
			`https://api.foursquare.com/v3/places/search?${searchParams}`,
			{
				method: 'GET',
				// @ts-ignore
				headers: {
					Accept: 'application/json',
					Authorization: process.env.FOURSQUARE_API_KEY,
				},
			}
		);
		const data = (await results.json()) as CoffeeShopsMainResponse;

		return data.results.map((res, ind) => {
			return { ...res, imgUrl: photos[ind] };
		});
	} catch (err) {
		console.error(err);
	}
}
