import axios from 'axios';
import { Button } from './ui/button';
// import { updateInvoice } from '@/Services';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import WalletLogo from '../assets/WalletLogo.svg';
const SERVER_LINK = import.meta.env.VITE_STRIPE_SERVER_LINK;

interface StripePayProps {
  stripeId: string;
  invoiceTotal: number;
  companyName: string;
  invoiceId: string;
  userId: string;
  setLoading?: (loading: boolean) => void;
  serialNumber?: string;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_SECRET_KEY || '', {
  locale: 'en',
});

const StripePay = ({
  stripeId,
  invoiceTotal,
  companyName,
  invoiceId,
  userId,
  serialNumber,
}: StripePayProps) => {
  const [clientSecret, setClientSecret] = useState('');

  // const appearance = {
  //   theme: 'stripe',
  // };
  // const options = {
  //   clientSecret,
  //   appearance,
  // };

  // const options = {
  //   clientSecret,
  //   appearance: {
  //     theme: 'stripe',
  //   },
  // };

  const handleStripePay = () => {
    axios
      .post(
        `${SERVER_LINK}/create-payment-intent`,
        { stripeId, invoiceTotal, companyName },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        const clientSecret = res.data.clientSecret;

        setClientSecret(clientSecret);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Button
        className="text-base m-3 w-11/12 mb-5 sm:w-36 sm:text-sm"
        onClick={handleStripePay}
      >
        <img className="h-5 mr-2" src={WalletLogo} alt="wallet icon" />
        Pay with Card
      </Button>

      {clientSecret && (
        <div
          className="absolute bg-slate-100 p-4 rounded-sm bottom-20 border shadow-xl"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transform: 'translate(-50%, +40%)',
          }}
        >
          <Elements
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
              },
            }}
            stripe={stripePromise}
          >
            <CheckoutForm
              clientSecret={clientSecret}
              invoiceId={invoiceId}
              userId={userId}
              serialNumber={serialNumber}
            />
          </Elements>
        </div>
      )}
    </>
  );
};

export default StripePay;
