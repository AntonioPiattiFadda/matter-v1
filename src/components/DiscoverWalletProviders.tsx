import { useEffect, useState } from 'react';
import { useSyncProviders } from '../Hooks/useSyncProviders';
import { formatAddress } from '@/utils';
import { CardDescription } from './ui/card';
import { Button } from './ui/button';
import Web3 from 'web3';
import { getUserById, updateUser } from '@/Services';
import MetaMaskLogo from '../assets/MetaMaskLogo.png';
interface DiscoverWalletProvidersProps {
  connections: {
    userInfo: boolean;
    stripe: boolean;
    metamask: boolean;
  };
  setConnections?: React.Dispatch<
    React.SetStateAction<{
      userInfo: boolean;
      stripe: boolean;
      metamask: boolean;
    }>
  >;

  loading?: boolean;
}

export const DiscoverWalletProviders = ({
  setConnections,
  connections,
  loading,
}: DiscoverWalletProvidersProps) => {
  const [userAccount, setUserAccount] = useState<string>('');
  const user = window.sessionStorage.getItem('user');
  const parsedUser = JSON.parse(user as string);

  useEffect(() => {
    //Controlar si el user tiene un metamask en la base de dataos
    if (!userAccount) {
      getUserById(parsedUser.id).then((user) => {
        if (user?.metamaskAddress) {
          setUserAccount(user.metamaskAddress);
          if (setConnections) {
            setConnections((prevState) => ({ ...prevState, metamask: true }));
          }
        }
      });
    }
  }, [parsedUser.id, setConnections, userAccount]);

  const providers = useSyncProviders();

  const handleConnect = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).ethereum) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (window as any).ethereum.enable(); // Solicita al usuario que permita acceder a su cuenta de MetaMask
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const web3 = new Web3((window as any).ethereum);
      const myAccounts = await web3.eth.getAccounts();
      const recipientWallet = myAccounts[0];
      setUserAccount(recipientWallet);
      if (setConnections) {
        setConnections((prevState) => ({ ...prevState, metamask: true }));
      }

      updateUser(parsedUser.id, { metamaskAddress: recipientWallet });
      window.sessionStorage.setItem('userAccount', recipientWallet);
    }
  };

  const handleDisconnect = () => {
    setUserAccount('');
    updateUser(parsedUser.id, { metamaskAddress: '' });
    window.sessionStorage.removeItem('userAccount');
    if (setConnections) {
      setConnections((prevState) => ({ ...prevState, metamask: false }));
    }
  };

  return (
    <>
      {!connections.metamask && (
        <>
          {' '}
          <div>
            {providers.length > 0 ? (
              <div>
                <CardDescription className="text-slate-900	font-semibold text-sm mt-6">
                  Setup crypto payouts
                </CardDescription>
                <Button
                  className="flex mt-3  w-full font-normal	text-sm"
                  onClick={() => handleConnect()}
                  disabled={loading}
                >
                  Connect Metamask Wallet{' '}
                  <img
                    className="h-6 translate-y-[.03rem] ml-2"
                    src={MetaMaskLogo}
                    alt="Matter Logo"
                  />{' '}
                </Button>
              </div>
            ) : (
              <div>
                <CardDescription className="text-slate-900	font-semibold text-sm mt-6">
                  Setup crypto payouts
                </CardDescription>
                <Button
                  className="flex mt-3  w-full font-normal	text-sm"
                  disabled
                >
                  Please Install Metamask{' '}
                  <img
                    className="h-6 translate-y-[.03rem] ml-2"
                    src={MetaMaskLogo}
                    alt="Matter Logo"
                  />{' '}
                </Button>
              </div>
            )}
          </div>
          <hr />
        </>
      )}
      {userAccount && (
        <div>
          <CardDescription className="mb-2 mt-2 text-black font-medium">
            Crypto Payouts Sending To:
          </CardDescription>
          <CardDescription className="">
            {formatAddress(userAccount)}
          </CardDescription>
          <Button
            className="flex font-normal text-sm p-0 text-sky-500"
            variant="link"
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        </div>
      )}
    </>
  );
};
