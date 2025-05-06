import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const formatMoney = (value: number | string) =>
  `$${Number(value).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;

const PhoneList: React.FC = () => {
  const [phones, setPhones] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'brand' | 'model' | 'price' | 'stock'>('model');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchPhones();
  }, [search]);

  const fetchPhones = async () => {
    try {
      const params = search ? { search } : {};
      const res = await api.get('/phones', { params });
      setPhones(res.data.data || []);
    } catch (e) {
      setPhones([]);
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

  const sortedPhones = [...phones].sort((a, b) => {
    const aValue = a[sortBy] || '';
    const bValue = b[sortBy] || '';
    if (aValue < bValue) return sortDir === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <h2 style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 28, marginBottom: 18 }}>Listado de Teléfonos</h2>
      <input
        type="text"
        placeholder="Buscar por modelo, marca, SO, procesador..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 14, padding: 8, width: 340, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
      />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 1100, background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
          <thead>
            <tr style={{ background: 'var(--color-primary)', color: 'white', fontWeight: 700, fontSize: 16 }}>
              <th style={{ padding: '12px 10px', borderTopLeftRadius: 16 }}>ID</th>
              <th style={{ padding: '12px 10px' }}>Marca</th>
              <th style={{ padding: '12px 10px' }}>Modelo {sortBy === 'model' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
              <th style={{ padding: '12px 10px' }}>Almacenamiento</th>
              <th style={{ padding: '12px 10px' }}>RAM</th>
              <th style={{ padding: '12px 10px' }}>Pantalla</th>
              <th style={{ padding: '12px 10px' }}>Sistema</th>
              <th style={{ padding: '12px 10px' }}>Procesador</th>
              <th style={{ padding: '12px 10px' }}>Descripción</th>
              <th style={{ padding: '12px 10px' }}>Precio {sortBy === 'price' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
              <th style={{ padding: '12px 10px', borderTopRightRadius: 16 }}>Stock {sortBy === 'stock' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
            </tr>
          </thead>
          <tbody>
            {sortedPhones.map((p, idx) => (
              <tr key={p.id} style={{
                background: idx % 2 === 0 ? '#f9f9fb' : '#fff',
                transition: 'background 0.2s',
                cursor: 'pointer'
              }}
                onMouseOver={e => (e.currentTarget.style.background = '#eaf6ff')}
                onMouseOut={e => (e.currentTarget.style.background = idx % 2 === 0 ? '#f9f9fb' : '#fff')}
              >
                <td style={{ padding: '10px 8px', fontSize: 15 }}>{p.id}</td>
                <td style={{ padding: '10px 8px' }}>{p.brand}</td>
                <td style={{ padding: '10px 8px' }}>{p.model}</td>
                <td style={{ padding: '10px 8px' }}>{p.storage}</td>
                <td style={{ padding: '10px 8px' }}>{p.ram}</td>
                <td style={{ padding: '10px 8px' }}>{p.display}</td>
                <td style={{ padding: '10px 8px' }}>{p.os}</td>
                <td style={{ padding: '10px 8px' }}>{p.processor}</td>
                <td style={{ padding: '10px 8px' }}>{p.description}</td>
                <td style={{ padding: '10px 8px', fontWeight: 600 }}>{formatMoney(p.price)}</td>
                <td style={{ padding: '10px 8px', fontWeight: 600 }}>{p.stock}</td>
              </tr>
            ))}
            {sortedPhones.length === 0 && (
              <tr><td colSpan={11} style={{ textAlign: 'center', color: '#888', padding: 18 }}>No hay teléfonos</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PhoneList;