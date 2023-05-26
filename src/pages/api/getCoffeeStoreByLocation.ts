import { fetchCoffeeStores } from '@/lib/coffee-store-search';
import { CoffeeShopsResult } from '@/typesFolder';
import { NextApiRequest, NextApiResponse } from 'next';

// http://localhost:3000/api/getCoffeeStoreByLocation?latLong=43.6538,-79.3789&limit=6

export interface GetCoffeeTypeReq extends NextApiRequest {
	query: {
		latLong: string;
		limit: string;
	};
}

const getCoffeeStoreByLocation = async (
	req: GetCoffeeTypeReq,
	res: NextApiResponse
) => {
	try {
		const { latLong, limit } = req.query;

		const results = (await fetchCoffeeStores(
			latLong,
			+limit
		)) as CoffeeShopsResult[];

		res.status(200);
		res.json(results);
	} catch (error) {
		console.error('There is an error');
		res.status(500);
		res.json({ message: 'Oh No ! Something went wrong' });
	}
};

export default getCoffeeStoreByLocation;
