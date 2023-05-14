import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import Banner from '@/components/banner/banner';
import Image from 'next/image';
import Card from '@/components/card';
import coffeeStoresData from '../../data/coffee-store.json';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import { CoffeeShopsMainResponse, CoffeeShopsResult } from '@/typesFolder';
import { fetchCoffeeStores } from '@/lib/coffee-store-search';

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
	coffeeStores: CoffeeShopsResult[];
};

export const getStaticProps: GetStaticProps = async () => {
	const results = (await fetchCoffeeStores()) as CoffeeShopsResult[];

	const coffeeStores = results;

	return {
		props: {
			coffeeStores,
		},
	};
};

const Home = ({ coffeeStores }: HomePageTypes): JSX.Element => {
	const onClickBannerHandler = () => {
		console.log('Click');
	};

	return (
		<>
			<main className={`${styles.main} `}>
				<Banner
					handleOnClick={onClickBannerHandler}
					buttonText={'View stores nearby'}
				/>
				<div className={styles.heroImage}>
					<Image
						src={'/static/hero-image.png'}
						width={700}
						height={400}
						alt='girls with coffee art'
						priority
					/>
				</div>
				{coffeeStores.length > 0 && (
					<div>
						<h2 className={styles.heading2}>Toronto stores</h2>

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
				)}
			</main>
		</>
	);
};

export default Home;
