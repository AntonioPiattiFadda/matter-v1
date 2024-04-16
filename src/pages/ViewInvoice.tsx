import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getInvoiceById, getUserById } from '@/Services';
import CompanyInfo from '../components/CompanyInfoComponent';
import { Invoice, User } from '@/types';
import { formatDate } from '@/utils/FormatDate';
import classNames from 'classnames';
import { DiscoverWalletProvidersPay } from '@/components/DiscoverWalletProvidersPay';
import StripePay from '@/components/StripePay';
import Loader from '@/components/Loader';
import MatterAlt from '../assets/MatterAlt.png';
import CopyIcon from '../assets/CopyIcon.png';
const NoBorderStyle = {
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
};

const ViewInvoice = () => {
  const { invoiceId, userId } = useParams();
  const [invoice, setInvoice] = useState<Invoice>({
    id: '',
    serialNumber: 0,
    date: null,
    dueDate: null,
    payDate: null,
    toCompanyName: '',
    toCompanyEmail: '',
    toCompanyAddress: '',
    toCompanyTaxId: '',
    subTotal: 0,
    tax: 0,
    discount: 0,
    shipping: 0,
    total: 0,
    notes: '',
    terms: '',
    status: '',
    metamaskAddress: '',
    stripeId: '',
  });
  const [invoiceItems, setInvoiceItems] = useState([
    {
      description: '',
      quantity: 0,
      price: 0,
      amount: 0,
    },
  ]);
  const [userCompanyInfo, setUserCompanyInfo] = useState({
    companyName: '',
    businessEmail: '',
    adress: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    taxId: '',
  });
  const [toCompanyInfo, setToCompanyInfo] = useState({
    companyName: '',
    businessEmail: '',
    adress: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    taxId: '',
  });
  const [coppied, setCoppied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (invoiceId) {
      getInvoiceById(userId ?? '', invoiceId ?? '').then(
        (data: Invoice | null) => {
          if (data) {
            const newDueDate = formatDate(data?.dueDate);
            data.dueDate = newDueDate;
            const newDate = formatDate(data?.date);
            data.date = newDate;
            const newPayDate = formatDate(data?.payDate);
            data.payDate = newPayDate;

            setToCompanyInfo({
              companyName: data.toCompanyName || '',
              businessEmail: data.toCompanyEmail || '',
              adress: data.toCompanyAddress || '',
              city: '',
              state: '',
              zip: '',
              country: '',
              taxId: data.toCompanyTaxId || '',
            });
          }

          setInvoice((data as unknown as Invoice) || null);
          setInvoiceItems(data?.items || []);

          setLoading(false);
          return;
        }
      );
    }
    getUserById(userId ?? '').then((data: User | null) => {
      if (!data) {
        return;
      }
      setUserCompanyInfo({
        companyName: data.companyName || '',
        businessEmail: data.businessEmail || '',
        adress: data.adress || '',
        city: data.city || '',
        state: data.state || '',
        zip: data.zip || '',
        country: data.country || '',
        taxId: data.taxId || '',
      });
    });
  }, [userId, invoice, invoiceId]);

  const handleCopy = () => {
    const url = `https://matterinvoice.app/view-invoice/${userId}/${invoice.id}`;
    navigator.clipboard.writeText(url);
    setCoppied(true);
    setTimeout(() => {
      setCoppied(false);
    }, 3000);
  };

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <div className="bg-slate-100 flex flex-col justify-center sm:items-center ">
      <nav
        className={classNames(
          'bg-black text-white flex justify-center items-center h-10 text-base w-full',
          {
            'bg-emerald-500': invoice.payDate !== null,
          }
        )}
      >
        <span className="w-[350px] text-center">
          {invoice.payDate !== null
            ? `This invoice was paid on ${invoice.payDate}`
            : 'This invoice has not been paid.'}
        </span>
      </nav>

      <Card className="m-2 mt-6 sm:w-[calc(100vw-24px)] sm:max-w-screen-md">
        <CardContent
          className="border flex justify-between items-center w-full h-full p-3"
          style={NoBorderStyle}
        >
          <CardDescription>
            Invoice{' '}
            <span className="font-semibold text-black">
              {invoice.serialNumber}
            </span>
          </CardDescription>
          <CardDescription className="flex flex-col justify-between sm:flex-row sm:gap-2">
            <p>
              Issued{' '}
              <span className="font-semibold text-black">
                {String(invoice.date)}
              </span>
            </p>
            <p>
              Due Date{' '}
              <span className="font-semibold text-black">
                {' '}
                {String(invoice.dueDate)}
              </span>
            </p>
          </CardDescription>
        </CardContent>
        <div className="flex flex-col sm:flex-row">
          <CardContent className="flex flex-col  h-[210px] w-full p-3 ">
            <CardDescription className="text-slate-500 text-sm font-semibold mb-2">
              From
            </CardDescription>
            <CompanyInfo editable={false} info={userCompanyInfo} />
          </CardContent>
          <CardContent className="flex flex-col  h-[210px] w-full p-3 border border-y-0 border-l-1 border-r-0">
            <CardDescription className="text-slate-500 text-sm font-semibold mb-2">
              To
            </CardDescription>
            <CompanyInfo editable={false} info={toCompanyInfo} />
          </CardContent>
        </div>
        <CardContent
          className="border flex flex-col justify-between  w-full h-full p-0"
          style={NoBorderStyle}
        >
          <Table className="w-full p-0">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] border border-r-0">
                  Description
                </TableHead>
                <TableHead className="text-end border border-l-0">
                  QTY
                </TableHead>
                <TableHead className="text-end border">Price</TableHead>
                <TableHead className="text-end border">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceItems.map((invoice) => {
                return (
                  <TableRow key={invoice.description}>
                    <TableCell className="w-[300px] border">
                      {invoice.description}
                    </TableCell>
                    <TableCell className="text-end border">
                      {invoice.quantity}
                    </TableCell>
                    <TableCell className="text-end border">
                      ${invoice.price}
                    </TableCell>
                    <TableCell className="text-end border">
                      ${invoice.amount}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <CardDescription className="flex justify-end items-center  m-2">
            <span>Subtotal</span>
            <span className="text-black text-xs font-semibold w-60 flex justify-end items-center gap-2">
              ${invoice.subTotal}
            </span>
          </CardDescription>

          {invoice.discount === 0 ? null : (
            <CardDescription className="flex justify-end items-center  m-2">
              <span>Discount</span>
              <span className="text-black text-xs font-semibold w-60 flex justify-end items-center gap-2">
                ${invoice.discount}
              </span>
            </CardDescription>
          )}

          {invoice.tax === 0 ? null : (
            <CardDescription className="flex justify-end items-center  m-2">
              <span>Tax</span>
              <span className="text-black text-xs font-semibold w-60 flex justify-end items-center gap-2">
                %{invoice.tax}
              </span>
            </CardDescription>
          )}

          {invoice.shipping === 0 ? null : (
            <CardDescription className="flex justify-end items-center  m-2">
              <span>Shipping</span>
              <span className="text-black text-xs font-semibold w-60 flex justify-end items-center gap-2">
                ${invoice.shipping}
              </span>
            </CardDescription>
          )}

          <CardDescription className="flex justify-end items-center  m-2">
            <span>Total</span>
            <span className="text-black text-lg font-bold w-60 flex justify-end items-center gap-2">
              ${invoice.total}
            </span>
          </CardDescription>
        </CardContent>

        <CardContent
          className="border flex flex-col justify-between  w-full h-full p-3"
          style={NoBorderStyle}
        >
          <CardDescription className="flex flex-col justify-between ">
            Notes
          </CardDescription>
          <CardDescription className="flex flex-col justify-between text-black ">
            {invoice.notes}
          </CardDescription>
        </CardContent>

        <CardContent
          className="border flex flex-col justify-between  w-full h-full p-3"
          style={NoBorderStyle}
        >
          <CardDescription className="flex flex-col justify-between ">
            Terms
          </CardDescription>
          <CardDescription className="flex flex-col justify-between text-black ">
            {invoice.terms}
          </CardDescription>
        </CardContent>

        {invoice.status === 'paid' ? null : (
          <div className="flex flex-col justify-center items-center sm:grid sm:gap-4  grid-col-2  sm:pt-2">
            <CardDescription className="text-black text-base m-5 sm:m-0 sm:col-start-1 sm:w-[300px] row-start-1 sm:translate-y-[-1rem]">
              Pay with crypto or card.
            </CardDescription>
            <div className=" sm:flex col-start-2 sm:w-[420px] justify-end">
              {invoice.metamaskAddress && (
                <DiscoverWalletProvidersPay
                  recipientWallet={invoice.metamaskAddress || ''}
                  totalAmount={invoice.total}
                  invoiceId={invoice.id || ''}
                  userId={userId || ''}
                />
              )}
              {invoice.stripeId && (
                <StripePay
                  stripeId={invoice.stripeId ?? ''}
                  invoiceTotal={invoice.total}
                  companyName={userCompanyInfo.companyName}
                  invoiceId={invoice.id || ''}
                  userId={userId || ''}
                />
              )}
            </div>
            <CardDescription className="flex gap-2 items-center mb-5 col-start-1 row-start-1 sm:translate-y-[1.2rem]">
              Powered by
              <img
                className="h-5 translate-y-[-.05rem]"
                src={MatterAlt}
                alt="matter logo"
              />
            </CardDescription>
          </div>
        )}
      </Card>
      <Button
        className="bg-slate-200 text-black text-base m-4 lg:absolute top-10 right-0"
        onClick={handleCopy}
        disabled={coppied}
      >
        <img className="h-5 mr-2" src={CopyIcon} alt="copy icon" />
        {coppied ? 'Link Copied!' : '  Copy Share Link'}{' '}
      </Button>
      <div className="bg-slate-100 h-52"></div>
    </div>
  );
};

export default ViewInvoice;
