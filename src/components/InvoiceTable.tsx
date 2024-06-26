/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DataTable } from './DataTable';
import { Link } from 'react-router-dom';
import { Connections, User, UserInvoices } from '@/types';
import { compareDates } from '@/utils/CompareDates';
import { formatDate } from '@/utils/FormatDate';
import CompleteAccountFirst from '../assets/CompleteAccountFirst.png';
import AddIcon from '../assets/AddIcon.svg';
import FirstInvoice from '../assets/FirstInvoice.png';
import React, { useState } from 'react';
import { deleteInvoice } from '@/Services';
import DeleteInvoiceModal from './DeleteInvoiceModal';
import DeteleIncon from '../assets/DeleteIcon.svg';

interface InvoiceTableProps {
  user: User;
  connections: Connections;
  invoices: UserInvoices[];
  setInvoices: React.Dispatch<React.SetStateAction<UserInvoices[]>>;
}

const InvoiceTable = ({
  user,
  connections,
  invoices,
  setInvoices,
}: InvoiceTableProps) => {
  const userSession = window.sessionStorage.getItem('user');
  const parsedUser = JSON.parse(userSession as unknown as string);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDeleteId, setInvoiceToDeleteId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleShowModal = (id: string) => {
    setInvoiceToDeleteId(id);
    setShowDeleteModal(true);
  };

  const cancelShowModal = () => {
    setInvoiceToDeleteId('');
    setShowDeleteModal(false);
  };

  const handleDelete = () => {
    setLoading(true);
    deleteInvoice(parsedUser.id, invoiceToDeleteId)
      .then(() => {
        const updatedInvoices = invoices.filter(
          (invoice) => invoice.id !== invoiceToDeleteId
        );
        setInvoices(updatedInvoices);
        setShowDeleteModal(false);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al eliminar la factura:', error);
      });
  };

  const columns = [
    {
      accessorKey: 'status',
      header: () => (
        <div className="text-base font-bold text-black">Status</div>
      ),
      cell: ({ row }: { row: any }) => {
        let message;
        let styles;
        const invoiceStatus = row.original.status;

        if (invoiceStatus === 'pending') {
          const isPastDue = compareDates(row.original.dueDate);
          if (isPastDue) {
            row.original.status = 'past due';
          }
        }
        let formattedPayDateStr;
        if (row.original.payDate) {
          formattedPayDateStr = formatDate(row.original.payDate);
        }

        switch (row.original.status) {
          case 'paid':
            message = `Paid on ${formattedPayDateStr}`;
            styles =
              'text-green-700 bg-green-100 font-medium text-base p-2 pl-4';
            break;
          case 'pending':
            message = 'Pending Payment';
            styles = 'bg-slate-100 font-medium text-base p-2 pl-4';
            break;
          case 'past due':
            message = 'Past Due';
            styles = 'bg-red-100 font-medium text-base p-2 pl-4 text-red-600';
            break;
          default:
            message = 'Estado desconocido';
        }
        return <div className={styles}>{message}</div>;
      },
    },
    {
      accessorKey: 'invoiceId',
      header: () => (
        <div className="text-base font-bold text-black">Invoice #</div>
      ),
      cell: ({ row }: { row: any }) => {
        return (
          <div className="font-medium text-base p-2 pl-4">
            {row.original.serialNumber}
          </div>
        );
      },
    },

    {
      accessorKey: 'from',
      header: () => <div className="text-base font-bold text-black">From</div>,
      cell: ({ row }: { row: any }) => {
        return (
          <div className="font-medium text-base p-2 pl-4">
            {row.original.from}
          </div>
        );
      },
    },
    {
      accessorKey: 'to',
      header: () => <div className="text-base font-bold text-black">To</div>,
      cell: ({ row }: { row: any }) => {
        return (
          <div className="font-medium text-base p-2 pl-4">
            {row.original.to}
          </div>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: () => (
        <div className="text-base font-bold text-black">Amount</div>
      ),
      cell: ({ row }: { row: any }) => {
        return (
          <div className="font-medium text-base p-2 pl-4">
            ${row.original.amount}
          </div>
        );
      },
    },
    {
      accessorKey: 'link',
      header: () => <div className="text-right"></div>,
      cell: ({ row }: { row: any }) => {
        return (
          <div className="text-right font-medium text-sky-600 p-2 pr-4 text-base">
            <a
              href={`/view-invoice/${user.id}/${row.original.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View
            </a>
          </div>
        );
      },
    },
    {
      accessorKey: 'link',
      header: () => <div className="text-right"></div>,
      cell: ({ row }: { row: any }) => {
        return (
          <div className="text-right font-medium text-sky-600 text-base grid content-center pl-1 cursor-pointer">
            <img
              className="h-5"
              onClick={() => handleShowModal(row.original.id)}
              src={DeteleIncon}
              alt="minus icon"
            />
          </div>
        );
      },
    },
  ];

  const walletConnections = connections.stripe || connections.metamask;

  if (!connections.userInfo || !walletConnections) {
    return (
      <div className="hidden  sm:grid place-content-center w-screen h-screen  bg-slate-50 ">
        <Card className="w-[500px] rounded-2xl">
          <CardHeader>
            <CardTitle>
              {' '}
              <img
                className="flex h-[300px] ml-2"
                src={CompleteAccountFirst}
                alt="Drop image"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-slate-900 font-bold text-lg">
              {' '}
              Hey! It’s time to add your biz details.
            </CardDescription>
          </CardContent>
          <CardFooter>
            <CardDescription className="text-slate-500 text-base ">
              Add your company details and connect Stripe or MetaMask. You can
              connect one or both.
            </CardDescription>
          </CardFooter>
        </Card>
      </div>
    );
  }
  if (invoices.length === 0) {
    return (
      <div className="hidden  sm:grid place-content-center w-screen h-screen  bg-slate-50">
        <Card className="w-[500px] rounded-2xl">
          <CardHeader>
            <CardTitle>
              {' '}
              <img
                className="flex h-[300px] ml-2"
                src={FirstInvoice}
                alt="Drop image"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-slate-900 font-bold text-xl">
              {' '}
              Good work, let’s try making your first invoice.{' '}
            </CardDescription>
            <CardDescription className="text-slate-500 text-sm font-sm mt-2">
              Create your first invoice, once you do you’ll see those here.{' '}
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button>
              <Link className="flex" to={'/create-invoice'}>
                <img className="h-4 mr-1" src={AddIcon} alt="add icon" />
                Create New
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="hidden  sm:flex flex-col w-full bg-white rounded-lg shadow-md">
      {showDeleteModal && (
        <DeleteInvoiceModal
          loading={loading}
          handleDelete={handleDelete}
          cancelShowModal={cancelShowModal}
        />
      )}
      <DataTable columns={columns} data={invoices} setInvoices={setInvoices} />
    </div>
  );
};

export default InvoiceTable;
