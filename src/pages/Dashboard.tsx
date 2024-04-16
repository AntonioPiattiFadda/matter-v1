import { useEffect, useState } from 'react';
import InvoiceTable from '../components/InvoiceTable';
import WalletConection from '../components/WalletConection';
import { Connections } from '@/types';

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
  const [skeleton, setSkeleton] = useState({
    user: true,
    metamask: true,
    stripe: true,
  });

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
        setSkeleton={setSkeleton}
        skeleton={skeleton}
      />
      <InvoiceTable user={user} connections={connections} skeleton={skeleton} />
    </div>
  );
};

export default Dashboard;
