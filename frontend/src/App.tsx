import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import ClientList from './page/ClientList';
import CreditList from './page/CreditList';
import PhoneList from './page/PhoneList';
import DashboardLayout from './components/layouts/DashboardLayout';
import ClientPage from './page/ClientPage';
import ClientRegisterForm from './components/ClientRegisterForm';

function RegisterClientWrapper() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const documentNumber = params.get('document_number') || '';
  return <ClientRegisterForm documentNumber={documentNumber} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<ClientPage />} />
          <Route path="clientes" element={<ClientPage />} />
          <Route path="clientes/:id" element={<ClientPage />} />
          <Route path="registrar-cliente" element={<RegisterClientWrapper />} />
          <Route path="creditos" element={<CreditList />} />
          <Route path="telefonos" element={<PhoneList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
