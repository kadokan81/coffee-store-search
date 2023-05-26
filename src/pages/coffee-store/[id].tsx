import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Image from 'next/image';
import styles from '../../styles/coffee-store.module.css';
import cls from 'classnames';
import { fetchCoffeeStores } from '@/lib/coffee-store-search';

import { CoffeeShopsResult } from '@/typesFolder';
import React from 'react';
import { StoreContext } from '../_app';
import useSWR from 'swr';
import { fetcher } from '@/utils';

export const getStaticProps: GetStaticProps = async (context: any) => {
	// This code runs only on server  client cant see it

	const results = (await fetchCoffeeStores()) as CoffeeShopsResult[];

	const coffeeStoresArr = results;

	const coffeeStoreById: CoffeeShopsResult | null =
		coffeeStoresArr.find((store) => store.fsq_id == context.params.id) || null;
	return {
		props: {
			coffeeStore: coffeeStoreById,
		},
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const results = (await fetchCoffeeStores()) as CoffeeShopsResult[];

	const coffeeStoresArr = results;
	const paths = coffeeStoresArr.map((store) => {
		return {
			params: {
				id: store.fsq_id.toString(),
			},
		};
	});
	return {
		paths: paths,
		fallback: true,
	};
};

type CoffeeStoreType = {
	coffeeStore: CoffeeShopsResult;
};

type DataBaseCoffeeStoreType = {
	id: number;
	name: string;
	voting: number;
	imgUrl: string;
	neighbourhood: string;
	address: string;
};

const CoffeeStore = (initialProps: CoffeeStoreType) => {
	const { useEffect, useState, useContext } = React;
	const [coffeeStore, setCoffeeStore] = useState(
		initialProps.coffeeStore || {}
	);

	const { coffeeStores } = useContext(StoreContext);

	const router = useRouter();

	const shopId = router.query.id;

	const handleCreateCoffeeStore = async (coffeeStore: any) => {
		try {
			const { id, name, voting, imgUrl, neighbourhood, address } = coffeeStore;
			const response = await fetch('/api/createCoffeeStore', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: initialProps.coffeeStore.fsq_id,
					name: initialProps.coffeeStore.name,
					voting: 0,
					imgUrl: initialProps.coffeeStore.imgUrl,
					neighbourhood: 'neighbourhood' || '',
					address: initialProps.coffeeStore.location.address,
				}),
			});

			const dbCoffeeStore = await response.json();
			// setVoting(dbCoffeeStore[0].voting);
		} catch (err) {
			console.error('Error creating coffee store', err);
		}
	};

	useEffect(() => {
		if (Object.keys(initialProps.coffeeStore).length === 0) {
			if (coffeeStores.length > 0) {
				const coffeeStore = coffeeStores.find(
					(store) => store.fsq_id == shopId
				);

				if (coffeeStore) {
					setCoffeeStore(coffeeStore);
					handleCreateCoffeeStore(coffeeStore);
				}
			}
		} else {
			// SSG
			handleCreateCoffeeStore(coffeeStore);
		}
	}, [
		shopId,
		initialProps.coffeeStore,
		coffeeStores,
		coffeeStore,
		handleCreateCoffeeStore,
	]);

	const [votingCount, setVotingCount] = useState(0);

	const { data, error } = useSWR(
		`/api/getCoffeeStoreById?id=${shopId}`,
		fetcher
	);

	useEffect(() => {
		if (data && data.length > 0) {
			// setCoffeeStore(data[0]);

			setVotingCount(data[0].voting);
		}
	}, [data]);

	if (router.isFallback) {
		return <div>Loading...</div>;
	}

	const handleUpVoteButton = async () => {
		const id = shopId;
		try {
			const response = await fetch('/api/favouriteCoffeeStoreById', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id,
				}),
			});

			const dbCoffeeStore = await response.json();

			if (dbCoffeeStore && dbCoffeeStore.length > 0) {
				let count = votingCount + 1;
				setVotingCount(count);
			}
		} catch (err) {
			console.error('Error up voting the coffee store', err);
		}
	};

	const imageLoader = () => {
		return initialProps.coffeeStore.imgUrl
			? initialProps.coffeeStore.imgUrl
			: 'https://plus.unsplash.com/premium_photo-1675716443562-b771d72a3da7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80';
		// return 'https://images.unsplash.com/photo-1620807773206-49c1f2957417?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80';
	};

	return (
		<div className={styles.layout}>
			<Head>
				<title>coffeeStore.name</title>
				<meta name='description' content={`${coffeeStore.name} coffee store`} />
			</Head>
			<div className={styles.container}>
				<div className={styles.col1}>
					<div className={styles.backToHomeLink}>
						<Link href='/'>← Back to home</Link>
					</div>
					<div className={styles.nameWrapper}>
						<h1 className={styles.name}>{coffeeStore.name}</h1>
					</div>
					<Image
						loader={imageLoader}
						src={imageLoader()}
						width={600}
						height={360}
						className={styles.storeImg}
						alt={coffeeStore.name}
					/>
				</div>

				<div className={cls('glass', styles.col2)}>
					{coffeeStore.location?.address && (
						<div className={styles.iconWrapper}>
							<Image
								src='/static/icons/places.svg'
								width='24'
								height='24'
								alt='places icon'
							/>

							<p className={styles.text}>
								{coffeeStore.location.formatted_address}
							</p>
						</div>
					)}
					<div className={styles.iconWrapper}>
						<Image
							src='/static/icons/nearMe.svg'
							width='24'
							height='24'
							alt='near me icon'
						/>
						<div className={styles.text}>Some text</div>
					</div>
					{coffeeStore.location.neighborhood && (
						<div className={styles.iconWrapper}>
							<Image
								src='/static/icons/nearMe.svg'
								width='24'
								height='24'
								alt='near me icon'
							/>
							{coffeeStore.location.neighborhood.map((n, ind) => (
								<div key={ind} className={styles.text}>
									n
								</div>
							))}
						</div>
					)}
					<div className={styles.iconWrapper}>
						<Image
							src='/static/icons/star.svg'
							width='24'
							height='24'
							alt='star icon'
						/>
						<p className={styles.text}>{votingCount}</p>
					</div>

					<button
						className={styles.upvoteButton}
						// onClick={handleUpVoteButton}
						onClick={() => setVotingCount((prev) => prev + 1)}>
						Up vote!
					</button>
				</div>
			</div>
		</div>
	);
};

export default CoffeeStore;
