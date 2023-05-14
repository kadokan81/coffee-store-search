import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import cls from 'classnames';

import styles from './card.module.css';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ShopsType } from '@/pages';

type CartType = {
	name: string;
	imgUrl: string;
	id: string;
};

const Card = ({ name, imgUrl, id }: CartType) => {
	const imageLoader = () => {
		return imgUrl;
	};
	return (
		<Link href={`/coffee-store/${id}`} className={styles.cardLink}>
			<div className={cls('glass', styles.container)}>
				<div className={styles.cardHeaderWrapper}>
					<h2 className={styles.cardHeader}>{name}</h2>
				</div>
				<div className={styles.cardImageWrapper}>
					<Image
						loader={imageLoader}
						className={styles.cardImage}
						src={imgUrl}
						width={260}
						height={160}
						alt={name}
					/>
				</div>
			</div>
		</Link>
	);
};

export default Card;
