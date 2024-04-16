/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Button } from './ui/button';
import Web3 from 'web3';
import axios from 'axios';
import PopUpMetamask from './PopUpMetamask';
import { RegisteredSubscription } from 'web3-eth';
import { updateInvoice } from '@/Services';
import ETHLogo from '../assets/ETHLogo.png';
import { useSyncProviders } from '@/Hooks/useSyncProviders';
import MetaMaskLogo from '../assets/MetaMaskLogo.png';
import BigNumber from 'bignumber.js';
const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

const ETH_NETWORK = import.meta.env.VITE_ETH_NETWORK;

interface DiscoverWalletProvidersProps {
  recipientWallet: string;
  totalAmount: number;
  invoiceId: string;
  userId: string;
}

export const DiscoverWalletProvidersPay = ({
  recipientWallet,
  totalAmount,
  invoiceId,
  userId,
}: DiscoverWalletProvidersProps) => {
  const [showPopUp, setShowPopUp] = useState({
    status: false,
    message: '',
  });
  const [transactionHash, setTransactionHash] = useState('');
  const providers = useSyncProviders();

  async function convertDollarsToEth(dollars: number) {
    const ethPriceResponse = await axios.get(
      `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ETHERSCAN_API_KEY}`
    );
    const ethPrice = new BigNumber(ethPriceResponse.data.result.ethusd);
    return new BigNumber(dollars).dividedBy(ethPrice).toFixed(18); // Usamos 18 decimales como en Ether
  }
  const showPopUpMessage = (message: string) => {
    setShowPopUp({
      status: true,
      message: message,
    });
    setTimeout(() => {
      setShowPopUp({
        status: false,
        message: '',
      });
    }, 3000);
  };

  async function sendEth(dollars: number) {
    try {
      // Asegúrate de que el navegador del usuario tenga MetaMask instalado.
      if ((window as any).ethereum) {
        await (window as any).ethereum.enable(); // Solicita al usuario que permita acceder a su cuenta de MetaMask
        const web3 = new Web3((window as any).ethereum);
        const myAccounts = await web3.eth.getAccounts();
        const senderWallet = myAccounts[0]; // La dirección del remitente, toma la primera cuenta de MetaMask

        const ethAmount = await convertDollarsToEth(dollars); // 0.00032011013253619835

        if (!ethAmount) return;
        const ethAmountInWei = web3.utils.toWei(ethAmount, 'ether');
        const isNetworkCorrect = await checkNetwork(web3); // Verifica si la red es correcta
        if (isNetworkCorrect) {
          // Envía ETH
          const transactionDetails = {
            from: senderWallet,
            to: recipientWallet,
            value: ethAmountInWei,
          };

          // Estimate gas limit for the transaction
          const estimatedGasLimit = await web3.eth.estimateGas(
            transactionDetails
          );

          // Fetch the current gas price from the network
          const currentGasPrice = await web3.eth.getGasPrice();

          // Convert the estimated gas limit to a string with a buffer for safety
          const gasLimit = (Number(estimatedGasLimit) * 1.2).toFixed(0); // Convert to Number first to apply the buffer, then to String

          // Send the transaction with the estimated gas limit and current gas price
          const transactionInfo = await web3.eth.sendTransaction({
            ...transactionDetails,
            gas: gasLimit, // Using string for gas limit
            gasPrice: currentGasPrice,
          });

          setTransactionHash(transactionInfo.transactionHash.toString());
          window.location.href = `/payment_result?metamask_payment_id=${transactionInfo.transactionHash.toString()}&invoice_id=${invoiceId}&user_id=${userId}`;
        } else {
          showPopUpMessage('Please connect to the Ethereum');
        }
      } else {
        showPopUpMessage('Please install MetaMask');
      }
    } catch (error) {
      showPopUpMessage('Error sending transaction');
      console.error(error);
    }
  }
  const NETWORK_ID = ETH_NETWORK;

  const checkNetwork = async (web3: Web3<RegisteredSubscription>) => {
    const chainId = await web3.eth.getChainId();
    const isCorrect = chainId.toString() === NETWORK_ID;
    return isCorrect;
  };

  return (
    <>
      <div className="relative">
        {showPopUp.status && (
          <PopUpMetamask
            message={showPopUp.message}
            transactionHash={transactionHash}
          />
        )}
        {providers.length > 0 ? (
          <div>
            <Button
              className="flex mt-3 mb-3 w-full font-normal	text-sm"
              onClick={() => sendEth(totalAmount)}
            >
              <img className="h-6" src={ETHLogo} alt="Matter Logo" />
              Pay with ETH
            </Button>
          </div>
        ) : (
          <div>
            <Button className="flex mt-3  w-full font-normal	text-sm" disabled>
              Please Install Metamask
              <img className="h-6" src={MetaMaskLogo} alt="Matter Logo" />
            </Button>
          </div>
        )}
      </div>
      <hr />
    </>
  );
};
