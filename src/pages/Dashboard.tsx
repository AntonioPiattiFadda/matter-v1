import { useEffect, useState } from 'react';
import InvoiceTable from '../components/InvoiceTable';
import WalletConection from '../components/WalletConection';
import { Connections, User, UserInvoices } from '@/types';
import { DashboardSkeleton } from '@/components/skeleton/DashBoardSkeleton';
import { getUserByEmail, getUserInvoices } from '@/Services';

const Dashboard = () => {
  const [connections, setConnections] = useState<Connections>({
    userInfo: false,
    stripe: false,
    metamask: false,
  });
  const [user, setUser] = useState({
    id: '',
    email: '',
  });
  const [invoices, setInvoices] = useState<UserInvoices[]>([]);
  const [loading, setLoading] = useState(true);
  const [userMetamaskAdress, setUserMetamaskAdress] = useState('');
  const [userStripeAddress, setUserStripeAddres] = useState('');

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
  useEffect(() => {
    const getCompanyInfo = getUserByEmail(user.email).then(
      (data: User | null) => {
        if (!data) {
          return;
        }
        if (
          data.adress &&
          data.businessEmail &&
          data.city &&
          data.companyName
        ) {
          setConnections((prevConnections: Connections) => ({
            ...prevConnections,
            userInfo: true,
          }));
        }
        setUserMetamaskAdress(data.metamaskAddress || '');
        setUserStripeAddres(data.stripeId || '');
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
      }
    );
    const getInvoicesFromUser = getUserInvoices(user.id || '').then((data) => {
      const mappedInvoices = data.map((invoice) => {
        return {
          id: invoice.id,
          serialNumber: invoice.serialNumber,
          status: invoice.status,
          from: invoice.companyName,
          to: invoice.toCompanyName,
          amount: invoice.total,
          dueDate: invoice.dueDate,
          payDate: invoice.payDate,
        };
      });
      setInvoices(mappedInvoices);
    });
    Promise.all([getCompanyInfo, getInvoicesFromUser]).then(() => {
      setLoading(false);
    });
  }, [setConnections, user]);

  useEffect(() => {
    if (user.id == '') {
      const usuarioGuardado = sessionStorage.getItem('user');
      if (!usuarioGuardado) {
        return;
      }
      const usuarioObjeto = JSON.parse(usuarioGuardado);
      setUser(usuarioObjeto);
    }
  }, [user]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <WalletConection
        user={user}
        setConnections={setConnections}
        connections={connections}
        companyInfo={companyInfo}
        setCompanyInfo={setCompanyInfo}
        userMetamaskAdress={userMetamaskAdress}
        userStripeAddress={userStripeAddress}
      />
      <InvoiceTable invoices={invoices} user={user} connections={connections} setInvoices={setInvoices} />
    </div>
  );
};

export default Dashboard;
