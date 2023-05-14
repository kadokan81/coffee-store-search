import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Image from 'next/image';
import styles from '../../styles/coffee-store.module.css';
import cls from 'classnames';
import { fetchCoffeeStores } from '@/lib/coffee-store-search';
import { CoffeeShopsMainResponse } from '@/typesFolder';
import { CoffeeShopsResult } from '@/typesFolder';

export const getStaticProps: GetStaticProps = async (context: any) => {
	// This code runs only on server  client cant see it

	const results = (await fetchCoffeeStores()) as CoffeeShopsResult[];

	const coffeeStoresArr = results;

	const coffeeStore: CoffeeShopsResult | null =
		coffeeStoresArr.find((store) => store.fsq_id == context.params.id) || null;
	return {
		props: {
			coffeeStore,
		},
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const results = (await fetchCoffeeStores()) as CoffeeShopsResult[];

	const coffeeStoresArr = results;
	const pathsArray = coffeeStoresArr.map((store) => {
		return {
			params: {
				id: store.fsq_id.toString(),
			},
		};
	});
	return {
		paths: pathsArray,
		fallback: true,
	};
};

type CoffeeStoreType = {
	coffeeStore: CoffeeShopsResult;
};

const CoffeeStore = ({ coffeeStore }: CoffeeStoreType) => {
	const router = useRouter();

	if (router.isFallback) {
		return <div>Loading...</div>;
	}

	const imageLoader = () => {
		return coffeeStore.imgUrl;
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
					{coffeeStore.location.address && (
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
							{coffeeStore.location.neighborhood.map((n) => (
								<div className={styles.text}>n</div>
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
						<p className={styles.text}>{12}</p>
					</div>

					<button className={styles.upvoteButton} onClick={() => {}}>
						Up vote!
					</button>
				</div>
			</div>
		</div>
	);
};

export default CoffeeStore;
