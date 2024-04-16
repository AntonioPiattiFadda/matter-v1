import { updateInvoice } from '@/Services';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentResult = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paymentId = searchParams.get('payment_id');
  const invoiceId = searchParams.get('invoice_id') ?? '';
  const userId = searchParams.get('user_id') ?? '';
  const metamaskPaymentId = searchParams.get('metamask_payment_id');

  useEffect(() => {
    if (paymentId) {
      updateInvoice(userId, invoiceId, {
        status: 'paid',
        stripeTransactionId: paymentId,
        payDate: new Date(),
      });
    }
    if (metamaskPaymentId) {
      updateInvoice(userId, invoiceId, {
        status: 'paid',
        metamaskHash: metamaskPaymentId,
        payDate: new Date(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-slate-100 bg-opacity-50">
        <div className="bg-white p-8 rounded shadow-md">
          <svg
            className="w-16 h-16 mx-auto text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className="text-center text-gray-800 mt-4">
            Success! You've completed your payment. Thank you.
          </p>
          <p className="text-center text-gray-800 mt-2">
            Transaction ID: {paymentId ? paymentId : metamaskPaymentId}
          </p>
        </div>
      </div>

      <div>PaymentResult</div>
    </div>
  );
};

export default PaymentResult;
