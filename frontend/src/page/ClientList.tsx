import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Client } from '../types/Client';

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'document' | 'email'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, [search]);

  const fetchClients = async () => {
    try {
      const params = search ? { document: search } : {};
      const res = await api.get('/clients', { params });
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setClients(data.map((c: any) => ({ ...c, document: c.document_number })));
    } catch (e) {
      setClients([]);
    }
  };

  const handleSort = (field: 'name' | 'document' | 'email') => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const sortedClients = [...clients].sort((a, b) => {
    const aValue = a[sortBy] || '';
    const bValue = b[sortBy] || '';
    if (aValue < bValue) return sortDir === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <h2 style={{ color: 'var(--color-primary)' }}>Clientes Registrados</h2>
      <input
        type="text"
        placeholder="Buscar por documento"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 8, padding: 4, width: 220 }}
      />
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
        <thead>
          <tr>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>Nombre {sortBy === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('document')}>Documento {sortBy === 'document' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('email')}>Correo {sortBy === 'email' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
          </tr>
        </thead>
        <tbody>
          {sortedClients.map(c => (
            <tr
              key={c.id}
              style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
              onClick={() => navigate(`/clientes/${c.id}`)}
            >
              <td>{c.name}</td>
              <td>{c.document}</td>
              <td>{c.email}</td>
            </tr>
          ))}
          {sortedClients.length === 0 && (
            <tr><td colSpan={3} style={{ textAlign: 'center', color: '#888' }}>No hay clientes</td></tr>
          )}
        </tbody>
      </table>
      <button onClick={() => navigate('/registrar-cliente')} style={{ marginTop: 16 }}>
        Registrar nuevo cliente
      </button>
    </div>
  );
};

export default ClientList;