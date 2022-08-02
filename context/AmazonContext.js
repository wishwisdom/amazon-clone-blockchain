import { createContext, useState, useEffect } from 'react';

import { useMoralis, useMoralisQuery } from 'react-moralis';
import { ethers } from 'ethers';

import { amazonAbi, amazonCoinAddress } from '../lib/constants';

export const AmazonContext = createContext();

export const AmazonProvider = ({ children }) => {
    const [username, setUsername] = useState(' ');
    const [nickname, setNickname] = useState('');
    const [assets, setAssets] = useState([]);
    //

    const [currentAccount, setCurrentAccount] = useState('');
    const [tokenAmount, setTokenAmount] = useState('');

    const [amountDue, setAmountDue] = useState('');

    const [etherscanLink, setEtherscanLink] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState('');

    const { authenticate, isAuthenticated, enableWeb3, Moralis, user, isWeb3Enabled } = useMoralis();

    const { data: assetsData, error: assertsDataError, isLoading: assetsDataIsLoading } = useMoralisQuery('assets');

    const [recentTransactions, setRecentTrasactions] = useState([]);
    const [ownedItems, setOwnedItems] = useState([]);

    const { data: userData, error: userDataError, isLoading: userDataIsLoading } = useMoralisQuery('_User');

    useEffect(() => {
        (async () => {
            await enableWeb3();

            if (isAuthenticated) {
                await getBalance();
                const currentUsername = await user?.get('nickname');
                setUsername(currentUsername);

                const account = await user?.get('ethAddress');
                setCurrentAccount(account);
            }
        })();
    }, [isAuthenticated, user, username, currentAccount]);

    useEffect(() => {
        (async () => {
            if (isWeb3Enabled) {
                await getOwnedAssets();
                await getAssets();
            }
        })();
    }, [isWeb3Enabled, assetsData, assetsDataIsLoading]);

    const handleUsername = () => {
        if (user) {
            if (nickname) {
                user.set('nickname', nickname);
                user.save();
                setNickname('');
            } else {
                console.log('No user');
            }
        }
    };
    const getBalance = async () => {
        try {
            if (!isAuthenticated || !currentAccount) return;

            const options = {
                contractAddress: amazonCoinAddress,
                functionName: 'balanceOf',
                abi: amazonAbi,
                params: {
                    account: currentAccount,
                },
            };

            if (isWeb3Enabled) {
                const response = await Moralis.executeFunction(options);

                setBalance(response.toString());
            }
        } catch (error) {
            console.log(error);
        }
    };

    const buyTokens = async () => {
        if (!isAuthenticated) {
            await authenticate();
        }

        const amount = ethers.BigNumber.from(tokenAmount);
        const price = ethers.BigNumber.from('100000000000000');
        const calcPrice = amount.mul(price);

        let options = {
            contractAddress: amazonCoinAddress,
            functionName: 'mint',
            abi: amazonAbi,
            msgValue: calcPrice,
            params: {
                amount,
            },
        };

        const transaction = await Moralis.executeFunction(options);
        const receipt = await transaction.wait(4); // 4 block
        setIsLoading(false);
        console.log(receipt);

        setEtherscanLink(`https://testnet.snowtrace.io/block${receipt.transactionHash}`);
    };

    const getAssets = async () => {
        try {
            await enableWeb3();
            setAssets(assetsData);
        } catch (error) {
            console.log(error);
        }
    };

    const listendToUpdate = async () => {
        let query = new Moralis.Query('EthTransactions');
        let subscription = await query.subscribe();
        subscription.on('update', async (object) => {
            console.log('New Transction');
            console.log(object);
            setRecentTrasactions([object]);
        });
    };

    const buyAsset = async (price, asset) => {
        try {
            if (!isAuthenticated) return;

            const options = {
                type: 'erc20',
                amount: price,
                receiver: amazonCoinAddress,
                contractAddress: amazonCoinAddress,
            };

            let transaction = await Moralis.transfer(options);

            const receipt = await transaction.wait();

            if (receipt) {
                const res = userData[0].add('ownedAssets', {
                    ...asset,
                    purchaseDate: Date.now(),
                    etherscanLink: `https://testnet.snowtrace.io/block${receipt.transactionHash}`,
                });

                await res.save().then(() => {
                    alert("You've successfully pucages");
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getOwnedAssets = async () => {
        try {
            if (userData[0]) {
                console.log('userData[0]', userData[0].attributes.ownedAssets);
                setOwnedItems((preveItems) => [...preveItems, userData[0].attributes.ownedAssets]);
            }
        } catch (erro) {}
    };

    return (
        <AmazonContext.Provider
            value={{
                isAuthenticated,
                nickname,
                setNickname,
                username,
                setUsername,
                handleUsername,
                assets,
                setAssets,
                balance,
                setTokenAmount,
                tokenAmount,
                setAmountDue,
                amountDue,
                isLoading,
                setIsLoading,
                setEtherscanLink,
                currentAccount,
                buyTokens,
                buyAsset,
                recentTransactions,
                ownedItems,
            }}
        >
            {children}
        </AmazonContext.Provider>
    );
};
