import React, { useContext } from 'react';
import { AmazonContext } from '../context/AmazonContext';
import Cards from './Cards';

import Header from './Header';

import Featured from './Featured';

const Main = () => {
    const styles = {
        container: `h-full w-full flex flex-col mt-[50px] pr-[50px] overflow-hidden `,
        recentTitle: `text-2xl font-bold text-center mb-[20px] text-center mt-[40px]`,
        recentTransactionsList: `flex flex-col`,
        transactionCard: `flex justify-between mb-[20px] p-[30px] bg-[#42667e] text-white rounded-xl shadow-xl font-bold gap-[20px] text-xl`,
    };
    const { recentTransactions } = useContext(AmazonContext);

    return (
        <div className={styles.container}>
            <Header />
            <Featured />
            <Cards />
            {/* {recentTransactions.length > 0 && <h1 className={styles.recentTitle}>Recent Traansaction</h1>}
            {recentTransactions &&
                recentTransactions.map((transction, idx) => {
                    return (
                        <div key={idx} className={styles.transactionsList}>
                            <div className={styles.transactionCard}>
                                <p>From: {transction.transction.from}</p>
                                <p>to: {transction.transction.to_address}</p>
                                <p>
                                    Hsh: {''}
                                    <a
                                        target={'_blank'}
                                        rel={'reopener noreferrer'}
                                        href={`https://testnet.snowtrace.io/block${transction.attributes.hash}`}
                                    >
                                        {transction.attributes.hash.slice(0, 10)}
                                    </a>
                                </p>
                                <p>Gas: {transction.attributes.gas} </p>
                            </div>
                        </div>
                    );
                })} */}
        </div>
    );
};

export default Main;
