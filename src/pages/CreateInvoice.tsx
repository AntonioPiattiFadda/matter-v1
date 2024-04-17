import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { SaveNewInvoiceInfoSchema } from '@/Validator';
import { useEffect, useState } from 'react';
import { z, ZodError } from 'zod';
import classNames from 'classnames';
import { Invoice, InvoiceItem, User } from '@/types';
import { createInvoice, getUserByEmail } from '@/Services';
import CompanyInfo from '../components/CompanyInfoComponent';
import InvoiceCreater from '../assets/InvoiceCreated.png';
import AddItem from '../assets/AddItem.png';
import DeleteItem from '../assets/DeleteItem.png';
import CopyBlackIcon from '../assets/CopyBlackIcon.png';
import AppConfetti from '@/components/confetti/AppConfetti';

const NoBorderStyle = {
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
};

const CreateInvoice = () => {
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
  const [user, setUser] = useState({
    id: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [stripeId, setStripeId] = useState('');
  const [metamaskAddress, setMetamaskAddress] = useState('');

  useEffect(() => {
    if (user.id == '') {
      const user = sessionStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        setUser(parsedUser);
        getUserByEmail(parsedUser.email).then((data: User | null) => {
          if (!data) {
            return;
          }
          setStripeId(data.stripeId || '');
          setMetamaskAddress(data.metamaskAddress || '');
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
      }
    }
  }, [user]);

  const [invoiceInfo, setInvoiceInfo] = useState<Invoice>({
    id: '',
    serialNumber: 0,
    date: null,
    dueDate: null,
    toCompanyName: '',
    toCompanyEmail: '',
    toCompanyAddress: '',
    toCompanyTaxId: '',
    subTotal: 0,
    discount: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    notes: '',
    terms: '',
    status: '',
    payDate: null,
    metamaskAddress: '',
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      description: '',
      name: '',
      price: 0,
      quantity: 0,
      amount: 0,
    },
  ]);

  const [total, setTotal] = useState<number>(0);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [errors, setErrors] = useState<ZodError<unknown> | null>(null);

  const [successCreation, setSuccessCreation] = useState({
    status: false,
    id: '',
    copied: false,
  });

  useEffect(() => {
    const subTotal = items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    setSubTotal(subTotal);

    const total = subTotal + invoiceInfo.shipping - invoiceInfo.discount;
    const totalWithTax = total + total * (invoiceInfo.tax / 100);
    setTotal(totalWithTax);
  }, [items, invoiceInfo.tax, invoiceInfo.shipping, invoiceInfo.discount]);

  const handleDeleteItem = (index: number) => {
    if (items.length === 1) return;
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  };

  const handleAddItem = () => {
    setItems((prevItems) => {
      return [
        ...prevItems,
        {
          description: '',

          price: 0,
          quantity: 0,
          amount: 0,
        },
      ];
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'serialNumber') {
      setInvoiceInfo({
        ...invoiceInfo,
        [name]: parseInt(value),
      });
      return;
    }
    if (name === 'tax' || name === 'shipping' || name === 'discount') {
      setInvoiceInfo({
        ...invoiceInfo,
        [name]: Number(value),
      });
      return;
    }
    if (name === 'date' || name === 'dueDate') {
      setInvoiceInfo({
        ...invoiceInfo,
        [name]: new Date(value),
      });
      return;
    }

    setInvoiceInfo({
      ...invoiceInfo,
      [name]: value,
    });
  };

  const handleChangeItems = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;

    if (name === 'price' || name === 'quantity' || name === 'amount') {
      const updatedItems = [...items];
      updatedItems[index] = {
        ...updatedItems[index],
        [name]: Number(value),
      };

      setItems(updatedItems);
      return;
    }

    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value,
    };

    setItems(updatedItems);
  };

  const handleSaveInvoice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const invoiceInfoToValidate = {
      ...invoiceInfo,
      items: items,
      status: 'pending',
      payDate: null,
      total: total,
      subTotal: subTotal,
      companyName: userCompanyInfo.companyName,
      metamaskAddress: metamaskAddress,
      stripeId: stripeId,
    };

    try {
      SaveNewInvoiceInfoSchema.parse(invoiceInfoToValidate);
      createInvoice(
        {
          ...invoiceInfoToValidate,
          metamaskAddress: invoiceInfoToValidate?.metamaskAddress,
          stripeId: invoiceInfoToValidate?.stripeId,
        },
        user.id
      ).then((res) => {
        setLoading(false);
        setSuccessCreation({
          status: true,
          id: res,
          copied: false,
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error);
        setLoading(false);
        console.log(error);

        setTimeout(() => {
          setErrors(null);
        }, 3000);
      }
    }
  };

  const handleCopy = () => {
    const url = `https://matterinvoice.app/view-invoice/${user.id}/${successCreation.id}`;
    navigator.clipboard.writeText(url);
    setSuccessCreation({
      ...successCreation,
      copied: true,
    });
    setTimeout(() => {
      setSuccessCreation({
        ...successCreation,
        copied: false,
      });
    }, 3000);
  };

  if (successCreation.status) {
    return (
      <div className="hidden  sm:grid place-content-center w-screen h-screen  bg-slate-50">
        <Card className="w-[500px] rounded-2xl flex flex-col items-center">
          <AppConfetti />
          <CardHeader>
            <CardTitle>
              {' '}
              <img
                className="flex h-48 ml-2"
                src={InvoiceCreater}
                alt="invoice creator icon"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-slate-900 font-bold text-xl">
              {' '}
              Your invoice is ready to share!{' '}
            </CardDescription>
            <CardDescription className="text-slate-500 text-base font-sm">
              Share with your customer to get paid.{' '}
            </CardDescription>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={handleCopy}>
              <img className="h-6 mr-1" src={CopyBlackIcon} alt="add icon" />
              {successCreation.copied ? 'Link Copied!' : 'Copy Invoice Link'}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                setSuccessCreation({ status: false, id: '', copied: false })
              }
            >
              <Link className="flex" to={`/dashboard`}>
                Done
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 flex flex-col justify-center sm:items-center relative">
      <Card className="m-2 sm:w-[calc(100vw-24px)] sm:max-w-screen-md mt-[60px] mb-[60px]">
        <form onSubmit={handleSaveInvoice}>
          <CardContent
            className="border flex justify-between items-center w-full h-full p-3"
            style={NoBorderStyle}
          >
            <CardDescription className="flex items-center gap-2">
              <Label className="text-slate-500 text-sm font-semibold">
                Invoice
              </Label>
              <Input
                placeholder="000001"
                className={classNames('font-semibold text-black', {
                  'border-red-500':
                    errors &&
                    errors.issues.some((issue) => {
                      return issue.path[0] === 'serialNumber';
                    }),
                })}
                id="serialNumber"
                name="serialNumber"
                type="text"
                onChange={handleChange}
              />
            </CardDescription>
            <CardDescription className="flex flex-col justify-between sm:flex-row sm:gap-2">
              <div className="flex items-center gap-2">
                <Label className="text-slate-500 text-sm font-semibold">
                  Issued
                </Label>
                <Input
                  className={classNames('w-28', {
                    'border-red-500':
                      errors &&
                      errors.issues.some((issue) => {
                        return issue.path[0] === 'date';
                      }),
                  })}
                  type="date"
                  placeholder="MM/DD/YYYY"
                  name="date"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-slate-500 text-sm font-semibold">
                  Due Date
                </Label>
                <Input
                  className={classNames('h-9 w-28', {
                    'border-red-500':
                      errors &&
                      errors.issues.some((issue) => {
                        return issue.path[0] === 'dueDate';
                      }),
                  })}
                  type="date"
                  placeholder="MM/DD/YYYY"
                  name="dueDate"
                  onChange={handleChange}
                />
              </div>
            </CardDescription>
          </CardContent>
          <div className="flex flex-col sm:flex-row h-[230px]">
            <CardContent
              className="border flex flex-col  w-full h-[230px] p-3"
              style={NoBorderStyle}
            >
              <CardDescription className="text-slate-500 text-sm font-semibold mb-2">
                From
              </CardDescription>
              <CompanyInfo editable={false} info={userCompanyInfo} />
            </CardContent>
            <CardContent
              className="border flex justify-between items-center w-full h-full p-3"
              style={NoBorderStyle}
            >
              <div className="w-full">
                <CardDescription className="text-slate-500 text-sm font-semibold mb-2">
                  To
                </CardDescription>
                <Input
                  className={classNames('h-9 mb-2', {
                    'border-red-500':
                      errors &&
                      errors.issues.some((issue) => {
                        return issue.path[0] === 'toCompanyName';
                      }),
                  })}
                  placeholder="Company Name"
                  name="toCompanyName"
                  value={invoiceInfo.toCompanyName}
                  onChange={handleChange}
                />
                <Input
                  className={classNames('h-9 mb-2', {
                    'border-red-500':
                      errors &&
                      errors.issues.some((issue) => {
                        return issue.path[0] === 'toCompanyEmail';
                      }),
                  })}
                  placeholder="Email"
                  name="toCompanyEmail"
                  value={invoiceInfo.toCompanyEmail}
                  onChange={handleChange}
                />
                <Input
                  className={classNames('h-9 mb-2', {
                    'border-red-500':
                      errors &&
                      errors.issues.some((issue) => {
                        return issue.path[0] === 'toCompanyAddress';
                      }),
                  })}
                  placeholder="Address (Optional)"
                  name="toCompanyAddress"
                  value={invoiceInfo.toCompanyAddress}
                  onChange={handleChange}
                />
                <Input
                  className={classNames('h-9 mb-2')}
                  placeholder="Tax ID"
                  name="toCompanyTaxId"
                  value={invoiceInfo.toCompanyTaxId}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </div>
          <CardContent
            className="border flex flex-col justify-between  w-full h-full p-3"
            style={NoBorderStyle}
          >
            <Table className="w-full p-0">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[320px]">Description</TableHead>
                  <TableHead>QTY</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {' '}
                        <Input
                          className={classNames('h-9', {
                            'border-red-500':
                              errors &&
                              errors.issues.some((issue) => {
                                return (
                                  issue.path[2] === 'description' &&
                                  issue.path[1] === index
                                );
                              }),
                          })}
                          placeholder="description"
                          name={`description`}
                          value={item.description}
                          onChange={(e) => handleChangeItems(e, index)}
                        />
                      </TableCell>
                      <TableCell>
                        {' '}
                        <span className="flex flex-row items-center gap-2">
                          <Input
                            className={classNames('h-9', {
                              'border-red-500':
                                errors &&
                                errors.issues.some((issue) => {
                                  return (
                                    issue.path[2] === 'quantity' &&
                                    issue.path[1] === index
                                  );
                                }),
                            })}
                            type="number"
                            placeholder="qty"
                            name={`quantity`}
                            value={items[index].quantity}
                            onChange={(e) => handleChangeItems(e, index)}
                          />
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex flex-row items-center gap-2">
                          $
                          <Input
                            className={classNames('h-9', {
                              'border-red-500':
                                errors &&
                                errors.issues.some((issue) => {
                                  return (
                                    issue.path[2] === 'price' &&
                                    issue.path[1] === index
                                  );
                                }),
                            })}
                            type="number"
                            placeholder="price"
                            name={`price`}
                            value={items[index].price}
                            onChange={(e) => handleChangeItems(e, index)}
                          />{' '}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex flex-row items-center gap-2">
                          $
                          <Input
                            className={classNames('h-9', {
                              'border-red-500':
                                errors &&
                                errors.issues.some((issue) => {
                                  return (
                                    issue.path[2] === 'amount' &&
                                    issue.path[1] === index
                                  );
                                }),
                            })}
                            type="number"
                            placeholder="amount"
                            name={`amount`}
                            value={items[index].price * items[index].quantity}
                            onChange={(e) => handleChangeItems(e, index)}
                            disabled
                          />{' '}
                        </span>
                      </TableCell>
                      <TableCell className="p-0">
                        <Button
                          className="h-2 flex bg-transparent p-0 w-7"
                          type="button"
                          onClick={() => handleDeleteItem(index)}
                        >
                          <img
                            className="w-full"
                            src={DeleteItem}
                            alt="deleteIcon"
                          ></img>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="w-full flex justify-end">
              <Button
                className="text-base bg-transparent text-black hover:bg-transparent "
                type="button"
                onClick={handleAddItem}
              >
                <img className="h-8" src={AddItem} alt="add icon" /> Add Line
                Item
              </Button>
            </div>

            <CardDescription className="flex justify-end items-center  m-2">
              <span>Subtotal</span>
              <span className="text-black text-lg w-60 text-end">
                ${subTotal}
              </span>
            </CardDescription>

            <CardDescription className="flex justify-end items-center  m-2">
              <span>Discount</span>
              <span className="text-black text-xs font-semibold w-60 flex justify-end items-center gap-2">
                $
                <Input
                  className="h-9 w-40"
                  type="number"
                  placeholder="Discount"
                  name="discount"
                  value={invoiceInfo.discount}
                  onChange={handleChange}
                />
              </span>
            </CardDescription>

            <CardDescription className="flex justify-end items-center  m-2">
              <span>Tax</span>
              <span className="text-black text-xs font-semibold w-60 flex justify-end items-center gap-2">
                %
                <Input
                  className="h-9 w-40"
                  type="number"
                  placeholder="Tax"
                  name="tax"
                  value={invoiceInfo.tax}
                  onChange={handleChange}
                />
              </span>
            </CardDescription>

            <CardDescription className="flex justify-end items-center  m-2">
              <span>Shipping</span>
              <span className="text-black text-xs font-semibold w-60 flex justify-end items-center gap-2">
                $
                <Input
                  className="h-9 w-40"
                  type="number"
                  placeholder="Shipping"
                  name="shipping"
                  value={invoiceInfo.shipping}
                  onChange={handleChange}
                />
              </span>
            </CardDescription>

            <CardDescription className="flex justify-end items-center  m-2">
              <span>Total</span>
              <span className="text-black text-lg font-semibold w-60 text-end">
                ${total}
              </span>
            </CardDescription>
          </CardContent>

          <CardContent
            className="border flex flex-col justify-between  w-full h-full p-3"
            style={NoBorderStyle}
          >
            <Label className="text-slate-500 text-sm mb-2">Notes</Label>
            <Input
              className={classNames('h-9 ', {
                'border-red-500':
                  errors &&
                  errors.issues.some((issue) => {
                    return issue.path[0] === 'notes';
                  }),
              })}
              id="code"
              placeholder="Enter any notes."
              name="notes"
              value={invoiceInfo.notes}
              onChange={handleChange}
            />
          </CardContent>

          <CardContent
            className="border flex flex-col justify-between  w-full h-full p-3"
            style={NoBorderStyle}
          >
            <Label className="text-slate-500 text-sm mb-2">Terms</Label>
            <Input
              className={classNames('h-9 ', {
                'border-red-500':
                  errors &&
                  errors.issues.some((issue) => {
                    return issue.path[0] === 'terms';
                  }),
              })}
              id="code"
              placeholder="Enter any terms."
              name="terms"
              value={invoiceInfo.terms}
              onChange={handleChange}
            />
          </CardContent>

          <Button
            className="text-base m-2 lg:absolute top-2 right-0"
            disabled={loading}
          >
            Save New Invoice
          </Button>
          <Button
            disabled={loading}
            className="bg-slate-200 text-black text-base m-2 lg:absolute top-2 left-0"
          >
            <Link to={'/dashboard'}>Cancel and Delete</Link>
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateInvoice;
