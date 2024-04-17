import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { CompanyInfo } from '@/types';
import UpcomingPayout from '@/assets/UpcomingPayout.png';

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
}

const CompanyInfoComponent = ({
  editable,
  info,
  setShowForm,
  setConnections,
}: CompanyInfoProps) => {
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
      <Card className="mb-6">
        <CardHeader>
          <img
            className="h-[70px] w-[70px]"
            src={UpcomingPayout}
            alt="Upcoming Payout"
          />
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-2  text-black font-medium text-sm">
            Upcoming Stripe Payout
          </CardDescription>
          <CardDescription className="mb-2  text-slate-500  text-sm">
            Payouts can take up to 5 days.
          </CardDescription>
          <CardDescription className="mb-2  text-black font-medium text-xl">
            $ 0.00
          </CardDescription>
        </CardContent>
      </Card>

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
