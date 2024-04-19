import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader } from './ui/card';
import DeleteInvoice from '../assets/DeleteInvoice.svg';

interface DeleteInvoiceModalProps {
  handleDelete: () => void;
  cancelShowModal: () => void;
  loading: boolean;
}

const DeleteInvoiceModal = ({
  handleDelete,
  cancelShowModal,
  loading,
}: DeleteInvoiceModalProps) => {
  return (
    <div className="absolute w-screen h-screen flex justify-center items-center top-0 left-0 bg-neutral-900 z-50 bg-opacity-25">
      <Card className="w-[514px] ">
        <CardHeader>
          <img className="h-[70px]" src={DeleteInvoice} alt="sign icon" />
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <CardDescription className="text-lg font-bold text-slate-900 m-2 ml-6">
            Are you sure?{' '}
          </CardDescription>
          <CardDescription className="text-sm m-2 ml-6 font-semibold text-slate-500 mb-8">
            This will delete forever.{' '}
          </CardDescription>
          <div>
            <Button
              variant="destructive"
              className="bg-red-50 text-red-600 mr-2 hover:text-white text-sm"
              onClick={handleDelete}
              disabled={loading}
            >
              Yes, delete it
            </Button>
            <Button
              className="text-sm"
              disabled={loading}
              onClick={cancelShowModal}
            >
              No, don’t delete it
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteInvoiceModal;
