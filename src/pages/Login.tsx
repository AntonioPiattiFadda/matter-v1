import { useEffect, useState } from 'react';
import { loginWithEmailSchema } from '@/Validator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import { z } from 'zod';
import {
  getAuth,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from 'firebase/auth';
import { createUser } from '@/Services';
import MatterLogoImg from '../assets/matterLogo.png';

const PROD_LINK = import.meta.env.VITE_PROD_LINK;

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: `${PROD_LINK}/login?code=true`,
  // This must be true.
  handleCodeInApp: true,
};

const Login = () => {
  const [sendedCode, setSendedCode] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<z.ZodError | null>(null);
  const [searchParams] = useSearchParams();

  const auth = getAuth();
  const code = searchParams.get('code');

  useEffect(() => {
    if (code) {
      setSendedCode(true);
      validateSingInWithEmailLink();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSendCode = () => {
    setLoading(true);
    try {
      loginWithEmailSchema.parse({ email });
      sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
          window.localStorage.setItem('emailForSignIn', email);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error);
        setTimeout(() => {
          setErrors(null);
          setLoading(false);
        }, 3000);
      }
    }
  };

  const validateSingInWithEmailLink = () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email =
          window.prompt('Please provide your email for confirmation') ?? '';
      }
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn');
          const user = {
            email,
            id: result.user.uid,
          };
          window.sessionStorage.setItem('user', JSON.stringify(user));

          createUser({ email: user.email }, user.id).then(() => {
            window.location.href = '/dashboard';
          });
        })
        .catch((error) => {
          setCodeError(true);
          console.log(error);
        });
    }
  };

  if (sendedCode) {
    return (
      <div className="grid place-content-center w-screen h-screen bg-slate-50">
        <Card className="w-[300px] sm:w-[350px]">
          <CardHeader>
            <CardTitle>
              {' '}
              <img className="h-7" src={MatterLogoImg} alt="Matter Logo" />
            </CardTitle>
          </CardHeader>
          <CardDescription className="text-sm m-2 ml-6">
            We are validating your email...
          </CardDescription>
          {codeError && (
            <Button
              className="flex p-1 text-sky-500 font-normal text-base m-4 ml-5 mb-5"
              variant="link"
              onClick={handleSendCode}
              disabled={loading}
            >
              Send email again
            </Button>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="grid place-content-center w-screen h-screen  bg-slate-50">
      <Card className="w-[300px] sm:w-[350px]">
        <CardHeader>
          <CardTitle>
            <img className="h-7" src={MatterLogoImg} alt="Matter Logo" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            {loading ? (
              <CardDescription className="text-sm mt-2  text-slate-500">
                We've emailed you a sign on link.
              </CardDescription>
            ) : (
              <>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      className={classNames('', {
                        'border-red-500':
                          errors &&
                          errors.issues.some((issue) => {
                            return issue.path[0] === 'email';
                          }),
                      })}
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      onChange={handleChangeEmail}
                    />
                  </div>
                </div>
                <Button
                  disabled={loading}
                  className="flex mt-2 text-sm font-normal"
                  type="button"
                  onClick={handleSendCode}
                >
                  Send Code
                </Button>
              </>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <CardDescription className="text-sm  text-slate-500">
            By continuing you agree to the terms found on
            matterinvoice.com/terms
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
