import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import Banner from '@/components/banner/banner';
import Image from 'next/image';
import Card from '@/components/card';
import { GetStaticProps } from 'next';
import { useContext, useEffect, useState } from 'react';
import { CoffeeShopsResult } from '@/typesFolder';
import { fetchCoffeeStores } from '@/lib/coffee-store-search';
import useTrackLocation from '@/hooks/useTrackLocation';
import { StoreContext } from './_app';

const inter = Inter({ subsets: ['latin'] });

export type ShopsType = {
	id: number;
	name: string;
	imgUrl: string;
	websiteUrl: string;
	address: string;
	neighborhood: string;
};

type HomePageTypes = {
	serverCoffeeStores: CoffeeShopsResult[];
};

export const getStaticProps: GetStaticProps = async () => {
	const results = (await fetchCoffeeStores()) as CoffeeShopsResult[];

	const serverCoffeeStores = results ? results : [];

	return {
		props: {
			serverCoffeeStores,
		},
	};
};

const Home = ({ serverCoffeeStores }: HomePageTypes): JSX.Element => {
	const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
		useTrackLocation();
	const { latLong, dispatch, coffeeStores } = useContext(StoreContext);

	useEffect(() => {
		const FetchCoffeeStoreHandler = async () => {
			// const results = (await fetchCoffeeStores(latLong)) as CoffeeShopsResult[];
			// console.log(
			// 	`http://localhost:3000/api/getCoffeeStoreByLocation?latLong=${latLong}9&limit=6`
			// );

			const results = await fetch(
				`http://localhost:3000/api/getCoffeeStoreByLocation?latLong=43.6538,-79.3789&limit=6`
			);

			const coffeeStoresLocal = await results.json();

			dispatch({
				type: 'SET_COFFEE_STORES',
				payload: {
					coffeeStores: coffeeStoresLocal,
				},
			});
		};
		if (latLong) {
			FetchCoffeeStoreHandler();
		}
	}, [latLong]);

	// console.log({ locationErrorMsg, latLong });

	const onClickBannerHandler = () => {
		handleTrackLocation();
	};

	return (
		<>
			<main className={`${styles.main} `}>
				<Banner
					handleOnClick={onClickBannerHandler}
					buttonText={!isFindingLocation ? 'View stores nearby' : 'Location...'}
				/>
				{locationErrorMsg && <p>Something went wrong :{locationErrorMsg}</p>}

				<div className={styles.heroImage}>
					<Image
						src={'/static/hero-image.png'}
						width={700}
						height={400}
						alt='girls with coffee art'
						priority
					/>
				</div>

				{coffeeStores ? (
					<div className={styles.sectionWrapper}>
						<h2 className={styles.heading2}>Local stores</h2>
						<div className={styles.cardLayout}>
							{coffeeStores.map((card) => (
								<Card
									key={card.fsq_id}
									name={card.name}
									id={card.fsq_id}
									imgUrl={card.imgUrl}
								/>
							))}
						</div>
					</div>
				) : (
					<div>No data</div>
				)}
				{serverCoffeeStores.length > 0 && (
					<div className={styles.sectionWrapper}>
						<h2 className={styles.heading2}>Toronto stores</h2>
						<div className={styles.cardLayout}>
							{serverCoffeeStores.map((card) => (
								<Card
									key={card.fsq_id}
									name={card.name}
									id={card.fsq_id}
									imgUrl={card.imgUrl}
								/>
							))}
						</div>
					</div>
				)}
			</main>
		</>
	);
};

export default Home;
