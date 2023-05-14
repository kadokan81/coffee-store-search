import React, { FC } from 'react';
import styles from './banner.module.css';

type BannerProps = {
	handleOnClick: () => void;
	buttonText: string;
};

const Banner = ({ handleOnClick, buttonText }: BannerProps): JSX.Element => {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>
				<span className={styles.title1}>Coffee</span>
				<span className={styles.title2}>Connoisseur</span>
			</h1>
			<p className={styles.subTitle}>Discover your local coffee stores!</p>
			<div className={styles.buttonWrapper}>
				<button className={styles.button} onClick={handleOnClick}>
					{buttonText}
				</button>
			</div>
		</div>
	);
};

export default Banner;
