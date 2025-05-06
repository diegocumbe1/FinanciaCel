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
      <h2 style={{ color: 'var(--color-primary)' }}>Listado de Teléfonos</h2>
      <input
        type="text"
        placeholder="Buscar por modelo, marca, SO, procesador..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 8, padding: 4, width: 320 }}
      />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8, minWidth: 1100 }}>
          <thead>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>ID</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('brand')}>Marca</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('model')}>Modelo {sortBy === 'model' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
              <th>Almacenamiento</th>
              <th>RAM</th>
              <th>Pantalla</th>
              <th>Sistema</th>
              <th>Procesador</th>
              <th>Descripción</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('price')}>Precio {sortBy === 'price' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('stock')}>Stock {sortBy === 'stock' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
            </tr>
          </thead>
          <tbody>
            {sortedPhones.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{p.id}</td>
                <td>{p.brand}</td>
                <td>{p.model}</td>
                <td>{p.storage}</td>
                <td>{p.ram}</td>
                <td>{p.display}</td>
                <td>{p.os}</td>
                <td>{p.processor}</td>
                <td>{p.description}</td>
                <td>{formatMoney(p.price)}</td>
                <td>{p.stock}</td>
              </tr>
            ))}
            {sortedPhones.length === 0 && (
              <tr><td colSpan={11} style={{ textAlign: 'center', color: '#888' }}>No hay teléfonos</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PhoneList;