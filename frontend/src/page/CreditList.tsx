import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const formatMoney = (value: number | string) =>
  `$${Number(value).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;

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
      <h2 style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 28, marginBottom: 18 }}>Listado de Créditos</h2>
      <input
        type="text"
        placeholder="Buscar por cliente o estado"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 14, padding: 8, width: 320, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
      />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 900, background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
          <thead>
            <tr style={{ background: 'var(--color-primary)', color: 'white', fontWeight: 700, fontSize: 16 }}>
              <th style={{ padding: '12px 10px', borderTopLeftRadius: 16 }}>ID {sortBy === 'id' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
              <th style={{ padding: '12px 10px' }}>Cliente</th>
              <th style={{ padding: '12px 10px' }}>Estado {sortBy === 'state' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
              <th style={{ padding: '12px 10px' }}>Monto {sortBy === 'amount' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
              <th style={{ padding: '12px 10px' }}>Plazo {sortBy === 'term' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
              <th style={{ padding: '12px 10px', borderTopRightRadius: 16 }}>Fecha {sortBy === 'created_at' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
            </tr>
          </thead>
          <tbody>
            {sortedCredits.map((c, idx) => (
              <tr key={c.id} style={{
                background: idx % 2 === 0 ? '#f9f9fb' : '#fff',
                transition: 'background 0.2s',
                cursor: 'pointer'
              }}
                onMouseOver={e => (e.currentTarget.style.background = '#eaf6ff')}
                onMouseOut={e => (e.currentTarget.style.background = idx % 2 === 0 ? '#f9f9fb' : '#fff')}
                onClick={() => {
                  console.log('Crédito:', c);
                  window.location.href = `/clientes/${c.client?.id || c.client_id}`;
                }}
              >
                <td style={{ padding: '10px 8px', fontSize: 15 }}>{c.id}</td>
                <td style={{ padding: '10px 8px' }}>{c.client?.name || c.client_id}</td>
                <td style={{ padding: '10px 8px' }}>{c.state}</td>
                <td style={{ padding: '10px 8px', fontWeight: 600 }}>{formatMoney(c.amount)}</td>
                <td style={{ padding: '10px 8px' }}>{c.term}</td>
                <td style={{ padding: '10px 8px' }}>{c.created_at?.slice(0, 10)}</td>
              </tr>
            ))}
            {sortedCredits.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888', padding: 18 }}>No hay créditos</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreditList;