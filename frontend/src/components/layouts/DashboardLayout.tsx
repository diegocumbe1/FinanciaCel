import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  const location = useLocation();

  const linkStyle = (path: string) => ({
    padding: '10px 20px',
    display: 'block',
    backgroundColor: location.pathname === path ? '#e0e0e0' : 'transparent',
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold'
  });

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', backgroundColor: '#f4f4f4', borderRight: '1px solid #ccc' }}>
        <h2 style={{ padding: '20px' }}>FinanciaCel</h2>
        <nav>
          <Link to="/clientes" style={linkStyle('/clientes')}>Clientes</Link>
          <Link to="/creditos" style={linkStyle('/creditos')}>Créditos</Link>
          <Link to="/telefonos" style={linkStyle('/telefonos')}>Teléfonos</Link>
          <Link to="/registrar-cliente" style={linkStyle('/registrar-cliente')}>Nuevo Cliente</Link>
        </nav>
      </div>

      {/* Contenido principal */}
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
