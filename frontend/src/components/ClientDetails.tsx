import React, { useState } from 'react';
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
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: '16px',
        padding: '32px',
        marginTop: '24px',
        color: '#222',
        fontFamily: 'var(--font-main)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <h3 style={{ color: 'var(--color-primary)', marginBottom: 18, fontSize: 26, fontWeight: 700 }}>Información del Cliente</h3>
      <div style={{ marginBottom: 18 }}>
        <p><strong>Nombre:</strong> {client.name}</p>
        <p><strong>Documento:</strong> {client.document}</p>
        {client.email && <p><strong>Correo:</strong> {client.email}</p>}
        {client.phone_number && <p><strong>Teléfono:</strong> {client.phone_number}</p>}
        {client.address && <p><strong>Dirección:</strong> {client.address}</p>}
      </div>

      {activeCredit && (
        <div style={{ marginTop: 20 }}>
          <div style={{
            padding: '14px',
            border: '2px solid',
            borderColor:
              activeCredit.state === 'approved' ? '#4BB543' :
              activeCredit.state === 'rejected' ? '#e74c3c' : '#aaa',
            background:
              activeCredit.state === 'approved' ? '#eafbe7' :
              activeCredit.state === 'rejected' ? '#ffeaea' : '#f9f9f9',
            color:
              activeCredit.state === 'approved' ? '#388e3c' :
              activeCredit.state === 'rejected' ? '#c0392b' : '#222',
            fontWeight: 600,
            fontSize: '1.1rem',
            marginBottom: 16,
            borderRadius: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
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
            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              <button
                onClick={() => updateCreditState('approved')}
                style={{
                  background: '#4BB543',
                  color: 'white',
                  border: 'none',
                  padding: '10px 22px',
                  marginRight: 8,
                  borderRadius: 7,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 16,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                }}
                disabled={loading}
              >
                Aprobar Crédito
              </button>
              <button
                onClick={() => updateCreditState('rejected')}
                style={{
                  background: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: 7,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 16,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
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
        <div style={{ marginTop: 18 }}>
          <p style={{ color: '#388e3c', fontWeight: 600 }}>
            No tiene créditos activos. Puede simular uno nuevo.
          </p>
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            style={{
              marginTop: 10,
              padding: '10px 22px',
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 7,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
            }}
          >
            {showSimulator ? 'Cerrar simulador' : 'Simular Crédito'}
          </button>

          {showSimulator && (
            <div style={{ marginTop: 18 }}>
              <CreditSimulator client={client} />
            </div>
          )}
        </div>
      )}

      {error && <p style={{ color: '#e74c3c', marginTop: 14 }}>{error}</p>}
    </div>
  );
};

export default ClientDetails;
