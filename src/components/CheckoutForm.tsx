import { useEffect, useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from './ui/button';

const PROD_LINK = import.meta.env.VITE_PROD_LINK;

interface CheckoutFormProps {
  clientSecret: string;
  invoiceId: string;
  userId: string;
}

export default function CheckoutForm({
  clientSecret,
  invoiceId,
  userId,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState('');

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // const clientSecret = new URLSearchParams(window.location.search).get(
    //   'payment_intent_client_secret'
    // );

    if (!clientSecret) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent) {
        setPaymentIntentId(paymentIntent.id as string);
      }

    });
  }, [clientSecret, invoiceId, stripe, userId]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${PROD_LINK}/payment_result?&invoice_id=${invoiceId}&user_id=${userId}&payment_id=${paymentIntentId}`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message ?? '');
    } else {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  // const paymentElementOptions = {
  //   layout: 'tabs',
  // };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <h1 className="mb-2 font-bold text-lg">Stripe payment</h1>
      <PaymentElement
        id="payment-element"
        options={{
          layout: 'tabs',
        }}
      />
      <Button
        className="p-2  border rounded-sm mt-2"
        disabled={isLoading || !stripe || !elements}
        variant="default"
        id="submit"
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : 'Pay now'}
        </span>
      </Button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
