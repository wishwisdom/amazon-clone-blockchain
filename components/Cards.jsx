import React, { useState, useContext } from 'react';
import { AmazonContext } from '../context/AmazonContext';
import Card from './Card';
const styles = {
    container: `h-full w-full flex flex-col ml-[20px] -mt-[50px]`,
    title: `text-xl font-bolder mb-[20px] mt-[30px]  ml-[30px]`,
    cards: `flex items-center  flex-wrap gap-[80px]`,
};

const Cards = () => {
    const { assets } = useContext(AmazonContext);
    console.log('assets', assets);
    return (
        <div className={styles.container}>
            <div className={styles.title}>New Release</div>
            <div className={styles.cards}>
                {/* <Card item={item} /> */}
                {assets.map((asset) => (
                    <Card key={asset.id} item={asset.attributes} />
                ))}
            </div>
        </div>
    );
};

export default Cards;
