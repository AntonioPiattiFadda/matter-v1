import { updateInvoice } from '@/Services';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppConfetti from './confetti/AppConfetti';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import PaidInvoice from '@/assets/PaidInvoice.png';
import PoweredByMatter from '@/assets/PoweredByMatter.png';

const PaymentResult = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paymentId = searchParams.get('payment_id');
  const invoiceId = searchParams.get('invoice_id') ?? '';
  const invoiceSerialNumber = searchParams.get('serial_number') ?? '';
  const userId = searchParams.get('user_id') ?? '';
  const metamaskPaymentId = searchParams.get('metamask_payment_id');

  const todaysDate = new Date();

  useEffect(() => {
    if (paymentId) {
      updateInvoice(userId, invoiceId, {
        status: 'paid',
        stripeTransactionId: paymentId,
        payDate: todaysDate,
      });
    }
    if (metamaskPaymentId) {
      updateInvoice(userId, invoiceId, {
        status: 'paid',
        metamaskHash: metamaskPaymentId,
        payDate: todaysDate,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId, metamaskPaymentId, paymentId, userId]);

  const formattedDate = todaysDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="hidden  sm:grid place-content-center w-screen h-screen  bg-slate-50">
      <Card className="w-[500px] rounded-2xl flex flex-col items-center">
        <AppConfetti />
        <CardHeader>
          <CardTitle>
            {' '}
            <img
              className="flex h-[300px] ml-2"
              src={PaidInvoice}
              alt="invoice creator icon"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-1">
          <CardDescription className="text-slate-900 font-semibold text-lg">
            {' '}
            Invoice Paid!
          </CardDescription>
          <CardDescription className="text-slate-500 text-sm font-sm">
            Invoice {invoiceSerialNumber}
          </CardDescription>
          <CardDescription className="text-slate-500 text-sm ">
            Paid on {formattedDate}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex gap-2">
          <img src={PoweredByMatter} alt="Powered by matter" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentResult;
