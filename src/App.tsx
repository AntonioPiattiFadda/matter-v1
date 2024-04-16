import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ProfileEditInfo from './pages/ProfileEditInfo';
import Dashboard from './pages/Dashboard';
import CreateInvoice from './pages/CreateInvoice';
import ViewInvoice from './pages/ViewInvoice';
import PaymentResult from './components/PaymentResult';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/create-invoice" element={<CreateInvoice />} />
          <Route path="/payment_result" element={<PaymentResult />} />
          <Route
            path="/view-invoice/:userId/:invoiceId"
            element={<ViewInvoice />}
          />
          <Route path="/edit-profile" element={<ProfileEditInfo />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
