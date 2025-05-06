// src/components/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div style={{
      width: '220px',
      height: '100vh',
      backgroundColor: '#f3f3f3',
      borderRight: '1px solid #ddd',
      padding: '1rem',
      position: 'fixed',
      top: 0,
      left: 0,
      fontFamily: 'var(--font-main)',
    }}>
      <h2 style={{ color: 'var(--color-primary)', marginBottom: '2rem' }}>FinanciaCel</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Link to="/credits" style={{ color: isActive('/credits') ? '#007bff' : '#333' }}>
          🧾 Créditos
        </Link>
        <Link to="/clients" style={{ color: isActive('/clients') ? '#007bff' : '#333' }}>
          👤 Clientes
        </Link>
        <Link to="/phones" style={{ color: isActive('/phones') ? '#007bff' : '#333' }}>
          📱 Teléfonos
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
