import { useEffect, useState } from 'react';
import CompanyInfo from './CompanyInfoComponent';
import { SaveCompanyInfoschema } from '@/Validator';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import classNames from 'classnames';
import { z, ZodError } from 'zod';
import { Connections, User } from '@/types';
import { getUserByEmail, updateUser } from '@/Services';
import { DiscoverWalletProviders } from './DiscoverWalletProviders';
import StripeConnection from './StripeConnection';
import { getAuth, signOut } from 'firebase/auth';
import matterLogo from '../assets/matterLogo.png';
import { Link } from 'react-router-dom';

interface WalletConectionProps {
  setConnections: React.Dispatch<
    React.SetStateAction<{
      userInfo: boolean;
      stripe: boolean;
      metamask: boolean;
    }>
  >;

  connections: Connections;
  user: User;
}

const WalletConection = ({
  setConnections,
  connections,
  user,
}: WalletConectionProps) => {
  const [showForm, setShowForm] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    businessEmail: '',
    adress: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    taxId: '',
  });
  const [errors, setErrors] = useState<ZodError<unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    getUserByEmail(user.email).then((data: User | null) => {
      if (!data) {
        return;
      }
      if (data.adress && data.businessEmail && data.city && data.companyName) {
        setConnections((prevConnections: Connections) => ({
          ...prevConnections,
          userInfo: true,
        }));
      }
      setCompanyInfo({
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
  }, [setConnections, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'zip' || name === 'taxId') {
      setCompanyInfo({
        ...companyInfo,
        [name]: parseInt(value),
      });
      return;
    }
    setCompanyInfo({
      ...companyInfo,
      [name]: value,
    });
  };

  const handleSaveCompanyInfo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      SaveCompanyInfoschema.parse(companyInfo);
      const userId = user.id ?? '';
      updateUser(userId, companyInfo).then(() => {
        setLoading(false);
        setConnections((prevConnections: Connections) => ({
          ...prevConnections,
          userInfo: true,
        }));
        setShowForm(false);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error);
        setLoading(false);
        setTimeout(() => {
          setErrors(null);
        }, 3000);
      }
    }
  };

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        window.sessionStorage.removeItem('user');
        window.location.href = '/';
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // const showInfo = !skeleton.user && !skeleton.metamask && !skeleton.stripe;

  return (
    <div>
      <Card
        className="w-[400px] sm-w-screen h-screen rounded-none"
        style={{
          borderTop: 'none',
          borderLeft: 'none',
          borderBottom: 'none',
        }}
      >
        <>
          <CardHeader>
            <CardTitle>
              {' '}
              <img className="h-7" src={matterLogo} alt="Matter Logo" />
            </CardTitle>
          </CardHeader>

          <CardContent>
            {connections.userInfo ? (
              <CompanyInfo
                editable={true}
                info={companyInfo}
                setShowForm={setShowForm}
                setConnections={setConnections}
              />
            ) : (
              <>
                <CardDescription
                  className={classNames('text-slate-900	font-semibold text-sm', {
                    hidden: showForm,
                  })}
                >
                  Complete yout account
                </CardDescription>

                <div
                  className={classNames('h-0 overflow-hidden pl-1 pr-1', {
                    'h-auto': showForm,
                  })}
                >
                  <CardDescription className="mb-4">
                    Your business information for invoicing
                  </CardDescription>
                  <form onSubmit={handleSaveCompanyInfo}>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label className="text-sm" htmlFor="name">
                          Company Name
                        </Label>
                        <Input
                          className={classNames('h-9 ', {
                            'border-red-500':
                              errors &&
                              errors.issues.some((issue) => {
                                return issue.path[0] === 'companyName';
                              }),
                          })}
                          id="code"
                          placeholder="Enter your company name"
                          name="companyName"
                          value={companyInfo.companyName}
                          onChange={handleChange}
                        />

                        <Label className="text-sm" htmlFor="email">
                          Business Email
                        </Label>
                        <Input
                          className={classNames('text-sm ', {
                            'border-red-500':
                              errors &&
                              errors.issues.some((issue) => {
                                return issue.path[0] === 'businessEmail';
                              }),
                          })}
                          id="email"
                          placeholder="Business Email"
                          name="businessEmail"
                          value={companyInfo.businessEmail}
                          onChange={handleChange}
                        />

                        <Label className="text-sm" htmlFor="adress">
                          Address
                        </Label>
                        <Input
                          className={classNames('text-sm', {
                            'border-red-500':
                              errors &&
                              errors.issues.some((issue) => {
                                return issue.path[0] === 'adress';
                              }),
                          })}
                          id="adress"
                          placeholder="860 Forest Ave"
                          name="adress"
                          value={companyInfo.adress}
                          onChange={handleChange}
                        />

                        <Label className="text-sm" htmlFor="city">
                          City
                        </Label>
                        <Input
                          className={classNames('text-sm ', {
                            'border-red-500':
                              errors &&
                              errors.issues.some((issue) => {
                                return issue.path[0] === 'city';
                              }),
                          })}
                          id="city"
                          placeholder="Palo Alto"
                          name="city"
                          value={companyInfo.city}
                          onChange={handleChange}
                        />

                        <Label className="text-sm" htmlFor="state">
                          State
                        </Label>
                        <Input
                          className={classNames('text-sm ', {
                            'border-red-500':
                              errors &&
                              errors.issues.some((issue) => {
                                return issue.path[0] === 'state';
                              }),
                          })}
                          id="state"
                          placeholder="California"
                          name="state"
                          value={companyInfo.state}
                          onChange={handleChange}
                        />

                        <Label className="text-sm" htmlFor="zip">
                          Zip
                        </Label>
                        <Input
                          className={classNames('text-sm ', {
                            'border-red-500':
                              errors &&
                              errors.issues.some((issue) => {
                                return issue.path[0] === 'zip';
                              }),
                          })}
                          id="zip"
                          type="number"
                          placeholder="94301"
                          name="zip"
                          value={companyInfo.zip}
                          onChange={handleChange}
                        />

                        <Label className="text-sm" htmlFor="Country">
                          Country
                        </Label>
                        <Input
                          className={classNames('text-sm ', {
                            'border-red-500':
                              errors &&
                              errors.issues.some((issue) => {
                                return issue.path[0] === 'country';
                              }),
                          })}
                          id="Country"
                          placeholder="Country"
                          name="country"
                          value={companyInfo.country}
                          onChange={handleChange}
                        />

                        <Label className="text-sm" htmlFor="taxId">
                          Tax ID
                        </Label>
                        <Input
                          className={classNames('text-sm ', {
                            'border-red-500':
                              errors &&
                              errors.issues.some((issue) => {
                                return issue.path[0] === 'taxId';
                              }),
                          })}
                          id="taxId"
                          type="number"
                          placeholder="12345"
                          name="taxId"
                          value={companyInfo.taxId}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="flex w-full gap-3 mb-4 justify-between">
                      <Button
                        className="flex mt-2 w-[50%] bg-gray-200 text-black "
                        onClick={() => setShowForm(false)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={loading}
                        type="submit"
                        className="flex mt-2 w-[50%]"
                      >
                        Save
                      </Button>
                    </div>
                  </form>
                </div>

                <Button
                  className={classNames(
                    'flex mt-3 mb-3 w-full font-normal	 text-sm',
                    {
                      hidden: showForm,
                    }
                  )}
                  onClick={() => setShowForm(true)}
                >
                  Add Your Company Details
                </Button>
              </>
            )}

            <div
              style={
                (connections.stripe || connections.metamask) && !showForm
                  ? { height: 'calc(100vh - 310px)' }
                  : { height: 'auto' }
              }
              className="flex flex-col justify-end h-screen"
            >
              <StripeConnection
                loading={loading}
                connections={connections}
                setConnections={setConnections}
              />

              <DiscoverWalletProviders
                loading={loading}
                connections={connections}
                setConnections={setConnections}
              />
            </div>
            <CardDescription>
              <div className="flex w-full gap-3 mt-2">
                <Button
                  className="flex p-1 text-slate-400 text-sm	"
                  variant="link"
                  onClick={handleLogOut}
                >
                  Log Out
                </Button>
                <Button
                  className="flex p-1 text-slate-400 text-sm	"
                  variant="link"
                >
                  <Link to="/support">Support</Link>
                </Button>
              </div>
            </CardDescription>
          </CardContent>
        </>
      </Card>
    </div>
  );
};

export default WalletConection;
