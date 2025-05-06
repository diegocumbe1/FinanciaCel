import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const CreditList: React.FC = () => {
  const [credits, setCredits] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'client' | 'state' | 'amount' | 'term' | 'created_at'>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchCredits();
  }, [search]);

  const fetchCredits = async () => {
    try {
      const params = search ? { search } : {};
      const res = await api.get('/credits', { params });
      setCredits(res.data.data || []);
    } catch (e) {
      setCredits([]);
    }
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const sortedCredits = [...credits].sort((a, b) => {
    const aValue = a[sortBy] || '';
    const bValue = b[sortBy] || '';
    if (aValue < bValue) return sortDir === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <h2 style={{ color: 'var(--color-primary)' }}>Listado de Créditos</h2>
      <input
        type="text"
        placeholder="Buscar por cliente o estado"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 8, padding: 4, width: 260 }}
      />
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
        <thead>
          <tr>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>ID {sortBy === 'id' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('client')}>Cliente</th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('state')}>Estado {sortBy === 'state' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('amount')}>Monto {sortBy === 'amount' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('term')}>Plazo {sortBy === 'term' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('created_at')}>Fecha {sortBy === 'created_at' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
          </tr>
        </thead>
        <tbody>
          {sortedCredits.map(c => (
            <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{c.id}</td>
              <td>{c.client?.name || c.client_id}</td>
              <td>{c.state}</td>
              <td>{c.amount}</td>
              <td>{c.term}</td>
              <td>{c.created_at?.slice(0, 10)}</td>
            </tr>
          ))}
          {sortedCredits.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>No hay créditos</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CreditList;