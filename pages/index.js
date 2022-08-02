import Main from '../components/Main';
import Sidebar from '../components/Sidebar';
import { ConnectWallet } from '@web3uikit/web3';

const styles = {
    container: 'h-full w-full flex bg-[#fff]',
};

export default function Home() {
    return (
        <div className={styles.container}>
            <Sidebar component={<ConnectWallet />} />
            <Main />
        </div>
    );
}
