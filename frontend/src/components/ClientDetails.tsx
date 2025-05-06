import React, { useState, useEffect } from 'react';
import api from '../api/axios';

import CreditSimulator from './CreditSimulator';
import { Client } from '../types/Client';

interface Instalment {
  number: number;
  amount: number;
  due_date: string;
}

interface CreditApplication {
  id: string;
  amount: number;
  term: number;
  state: string;
  created_at: string;
  phone: {
    model: string;
    price: number;
  };
  instalments?: Instalment[];
}

const formatMoney = (value: number) =>
  `$${Number(value).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;

const ClientDetails: React.FC<{ client: Client; onUpdate?: (client: Client) => void }> = ({ client, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSimulator, setShowSimulator] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'document' | 'email'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

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

  const activeCredit = client.credit_applications?.find(
    (c) => c.state === 'pending' || c.state === 'approved' || c.state === 'rejected'
  );

  const updateCreditState = async (newState: 'approved' | 'rejected') => {
    if (!activeCredit) return;
    setLoading(true);
    setError('');
    try {
      await api.patch(`/credits/${activeCredit.id}`, { state: newState });
      if (onUpdate) {
        const updated = await api.get(`/clients/${client.id}`);
        onUpdate(updated.data.data);
      }
    } catch (e: any) {
      setError(e.response?.data?.error || 'Error al actualizar estado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-light)',
        border: '1px solid var(--color-primary)',
        borderRadius: '10px',
        padding: '16px',
        marginTop: '16px',
        color: 'var(--color-dark)',
        fontFamily: 'var(--font-main)',
      }}
    >
      <h3 style={{ color: 'var(--color-primary)', marginBottom: 10 }}>Información del Cliente</h3>
      <p><strong>Nombre:</strong> {client.name}</p>
      <p><strong>Documento:</strong> {client.document}</p>
      {client.email && <p><strong>Correo:</strong> {client.email}</p>}
      {client.phone_number && <p><strong>Teléfono:</strong> {client.phone_number}</p>}
      {client.address && <p><strong>Dirección:</strong> {client.address}</p>}

      {activeCredit && (
        <div style={{ marginTop: 20 }}>
          <div style={{
            padding: '12px',
            border: '2px solid',
            borderColor:
              activeCredit.state === 'approved' ? 'green' :
              activeCredit.state === 'rejected' ? 'crimson' : 'gray',
            backgroundColor:
              activeCredit.state === 'approved' ? '#e6ffed' :
              activeCredit.state === 'rejected' ? '#ffe6e6' : '#f9f9f9',
            color:
              activeCredit.state === 'approved' ? 'green' :
              activeCredit.state === 'rejected' ? 'crimson' : 'black',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            marginBottom: 12,
            borderRadius: 8
          }}>
            {activeCredit.state === 'approved' && '✅ Crédito Aprobado'}
            {activeCredit.state === 'rejected' && '❌ Crédito Rechazado'}
            {activeCredit.state === 'pending' && '⏳ Crédito Pendiente'}
          </div>

          <p><strong>Estado:</strong> {activeCredit.state}</p>
          <p><strong>Teléfono:</strong> {activeCredit.phone.model} - {formatMoney(Number(activeCredit.phone.price))}</p>
          <p><strong>Monto:</strong> {formatMoney(activeCredit.amount)}</p>
          <p><strong>Plazo:</strong> {activeCredit.term} meses</p>

          {activeCredit.state === 'approved' && activeCredit.instalments && activeCredit.instalments.length > 0 && (
            <div style={{ maxHeight: '180px', overflowY: 'auto', marginTop: 10 }}>
              <strong>Cuotas:</strong>
              <ul>
                {activeCredit.instalments.map((i: Instalment) => (
                  <li key={i.number}>
                    Cuota #{i.number}: {formatMoney(i.amount)} - vence el {i.due_date}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeCredit.state === 'pending' && (
            <div style={{ marginTop: 16 }}>
              <button
                onClick={() => updateCreditState('approved')}
                style={{
                  backgroundColor: 'green',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  marginRight: 8,
                  borderRadius: 5,
                  cursor: 'pointer',
                }}
                disabled={loading}
              >
                Aprobar Crédito
              </button>
              <button
                onClick={() => updateCreditState('rejected')}
                style={{
                  backgroundColor: 'crimson',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 5,
                  cursor: 'pointer',
                }}
                disabled={loading}
              >
                Rechazar Crédito
              </button>
            </div>
          )}
        </div>
      )}

      {!activeCredit && (
        <div style={{ marginTop: 10 }}>
          <p style={{ color: 'green' }}>
            No tiene créditos activos. Puede simular uno nuevo.
          </p>
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            style={{
              marginTop: 8,
              padding: '8px 16px',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              cursor: 'pointer'
            }}
          >
            {showSimulator ? 'Cerrar simulador' : 'Simular Crédito'}
          </button>

          {showSimulator && (
            <div style={{ marginTop: 16 }}>
              <CreditSimulator client={client} />
            </div>
          )}
        </div>
      )}

      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    </div>
  );
};

export default ClientDetails;
