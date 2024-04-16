import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardDescription } from './ui/card';

interface PopUpMetamaskProps {
  message: string;
  transactionHash?: string;
}

const PopUpMetamask = ({ message, transactionHash }: PopUpMetamaskProps) => {
  const [coppied, setCoppied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(transactionHash || '');
    setCoppied(true);
    setTimeout(() => {
      setCoppied(false);
    }, 1000);
  };
  return (
    <div className="grid place-content-center bg-slate-50 absolute top-16 w-auto">
      <Card>
        <CardDescription className="text-sm p-4">
          {message} {(transactionHash && transactionHash) || ''}
          {transactionHash && (
            <Button disabled={coppied} onClick={handleCopy}>
              {coppied ? 'Copy' : 'Coppied'}
            </Button>
          )}
        </CardDescription>
      </Card>
    </div>
  );
};

export default PopUpMetamask;
