import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { CompanyInfo } from '@/types';
import UpcomingPayout from '@/assets/UpcomingPayout.png';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const STRIPE_SK = import.meta.env.VITE_STRIPE_SK;

interface CompanyInfoProps {
  editable: boolean;
  info: CompanyInfo;
  setShowForm?: (value: boolean) => void;
  setConnections?: React.Dispatch<
    React.SetStateAction<{
      userInfo: boolean;
      stripe: boolean;
      metamask: boolean;
    }>
  >;
  userStripeAddress?: string;
}

const CompanyInfoComponent = ({
  editable,
  info,
  setShowForm,
  setConnections,
  userStripeAddress,
}: CompanyInfoProps) => {
  const [pending, setPending] = useState(0);
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    const userStripeInfo = axios.get('https://api.stripe.com/v1/balance', {
      headers: {
        Authorization: `Bearer ${STRIPE_SK}`,
        'Stripe-Account': userStripeAddress,
      },
    });
    userStripeInfo
      .then((res) => {
        const pendingAmount = res.data.pending;
        const totalPendingAmount = pendingAmount.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (acc: number, curr: any) => acc + curr.amount,
          0
        );
        setPending(totalPendingAmount);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [userStripeAddress]);

  const handleEditInfo = () => {
    if (setShowForm) {
      setShowForm(true);
    }
    if (setConnections) {
      setConnections((prevState) => ({ ...prevState, userInfo: false }));
    }
  };

  return (
    <div>
      {isDashboard && pending ? (
        <Card className="mb-6">
          <CardHeader>
            <img
              className="h-[70px] w-[70px]"
              src={UpcomingPayout}
              alt="Upcoming Payout"
            />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-1  text-black font-medium text-sm">
              Upcoming Stripe Payout
            </CardDescription>
            <CardDescription className="mb-1  text-slate-500  text-sm">
              Payouts can take up to 5 days.
            </CardDescription>
            <CardDescription className="mb-2  text-black font-medium text-xl">
              $ {pending}
            </CardDescription>
          </CardContent>
        </Card>
      ) : null}

      <CardDescription className="mb-2  text-black font-medium text-xl">
        {info.companyName}
      </CardDescription>
      <CardDescription className="text-xs font-medium mb-2">
        {info.businessEmail}
      </CardDescription>
      <CardDescription className="text-xs font-medium">
        {info.adress}
      </CardDescription>
      <CardDescription className="text-xs font-medium mb-2">
        {info.city && `${info.city},${info.state},${info.country},${info.zip}`}
      </CardDescription>
      <CardDescription className="text-xs font-medium">
        {info.taxId && `Tax ID: ${info.taxId}`}
      </CardDescription>
      {editable && (
        <Button
          style={pending ? { marginBottom: '0' } : { marginBottom: '26vh' }}
          className="flex font-normal text-sm p-0 text-sky-500"
          variant="link"
          onClick={handleEditInfo}
        >
          Edit Details
        </Button>
      )}
    </div>
  );
};

export default CompanyInfoComponent;
