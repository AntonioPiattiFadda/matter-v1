import { Button } from '@/components/ui/button';
import { CardDescription } from '@/components/ui/card';

const MetamaskConectionInfo = () => {
  return (
    <div>
      <CardDescription className="mb-2 mt-2 text-black font-medium">
        Crypto Payouts Sending To:{' '}
      </CardDescription>
      <CardDescription className="">
        1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa{' '}
      </CardDescription>
      <Button
        className="flex font-normal text-sm p-0 text-sky-500"
        variant="link"
      >
        Disconnect
      </Button>
    </div>
  );
};

export default MetamaskConectionInfo;
