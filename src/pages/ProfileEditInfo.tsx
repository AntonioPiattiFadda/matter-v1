import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
const ProfileEditInfo = () => {
  const [newUserInfo, setNewUserInfo] = useState({
    name: '',
    email: '',
  });
  const handleSaveChanges = () => {
    //NOTE -  - Logica de guardado de los datos
  };
  useEffect(() => {
    //NOTE - Logica de carga de datos
    setNewUserInfo({
      name: 'Pedro Duarte',
      email: 'asdfdfs@gmail.com',
    });
  }, [newUserInfo]);

  return (
    <div className="grid place-content-center w-screen h-screen bg-slate-50">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Matter</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>Edit profile</CardDescription>

          <CardDescription className="flex items-center">
            Make changes to your profile here. Click save when you're done.
          </CardDescription>

          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Name</Label>
                <Input id="email" placeholder="Email" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="@peduarte" />
              </div>
            </div>
            <Button className="flex mt-2" onClick={handleSaveChanges}>
              Save changes
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <CardDescription>
            By signing up you agree to terms on
            business.matter.market/invoiceterms
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileEditInfo;
