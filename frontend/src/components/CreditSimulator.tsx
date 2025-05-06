import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Client } from '../types/Client';
import { useNavigate } from 'react-router-dom';

interface Phone {
  id: string;
  model: string;
  price: number;
}

interface Instalment {
  number: number;
  amount: number;
  due_date: string;
}

interface SimulationResult {
  total_amount: number;
  monthly_amount: number;
  instalments: Instalment[];
}

interface Props {
  client: Client;
}

const CreditSimulator: React.FC<Props> = ({ client }) => {
    
  const [phones, setPhones] = useState<Phone[]>([]);
  const [phoneId, setPhoneId] = useState('');
  const [term, setTerm] = useState(12);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    api.get('/phones')
      .then(res => setPhones(res.data.data ?? []))
      .catch(() => setPhones([]));
  }, []);

  const simulate = async () => {
    setError('');
    const phone = phones.find(p => p.id === phoneId);
    if (!phone) return setError('Selecciona un celular válido');
    try {
      const res = await api.get('/credits/simulate', {
        params: {
          amount: phone.price,
          term,
        },
      });
      setSimulation(res.data);
    } catch (e) {
      setError('No se pudo simular el crédito');
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--color-bg)',
      fontFamily: 'var(--font-main)',
      padding: 30,
      maxWidth: 600,
      margin: 'auto',
      borderRadius: 12,
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    }}>
      {toast && (
        <div style={{
          position: 'fixed',
          top: 30,
          right: 30,
          background: '#4BB543',
          color: 'white',
          padding: '16px 32px',
          borderRadius: 8,
          fontWeight: 'bold',
          fontSize: 18,
          zIndex: 9999,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          {toast}
        </div>
      )}
      <h2 style={{ color: 'var(--color-accent)', fontWeight: 'bold', textAlign: 'center' }}>
        Simulador de Crédito <span style={{ color: 'var(--color-primary)' }}>Celu</span><span style={{ color: 'var(--color-secondary)' }}>Tecn</span>
      </h2>

      <label><strong>Celular:</strong></label>
      <select value={phoneId} onChange={e => setPhoneId(e.target.value)} style={{ width: '100%', marginBottom: 12 }}>
        <option value="">Seleccione</option>
        {phones.map(p => (
          <option key={p.id} value={p.id}>
            {p.model} - ${parseInt(p.price.toString()).toLocaleString()}
          </option>
        ))}
      </select>

      <label><strong>Plazo (meses):</strong></label>
      <select value={term} onChange={e => setTerm(Number(e.target.value))} style={{ width: '100%', marginBottom: 12 }}>
        {[6, 12, 18, 24, 36].map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      <button onClick={simulate} style={{
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        fontWeight: 'bold',
        width: '100%',
        borderRadius: 5,
        cursor: 'pointer',
        marginBottom: 12
      }}>
        Simular crédito
      </button>

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      {simulation && (
        <div style={{ marginTop: 20 }}>
        <h3 style={{ color: '#007bff' }}>Resultado:</h3>
        <p>Total a pagar: <strong>${simulation.total_amount.toLocaleString()}</strong></p>
<p>Cuota mensual: <strong>${simulation.monthly_amount.toLocaleString()}</strong></p>

        <h4>Cuotas:</h4>
        <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: 10 }}>
          <ul>
            {simulation.instalments.map(i => (
              <li key={i.number}>
                Cuota #{i.number}: ${i.amount.toLocaleString()} - vence el {i.due_date}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      )}

{simulation && client && (
  <button
    onClick={async () => {
      try {
        const res = await api.post('/credits', {
          client_id: client.id,
          phone_id: phoneId,
          term,
        });
        setToast('Crédito creado exitosamente');
        setTimeout(() => {
          setToast(null);
          navigate('/creditos');
        }, 1800);
      } catch (e: any) {
        setToast(e.response?.data?.error || 'Error al crear crédito');
        setTimeout(() => setToast(null), 2500);
      }
    }}
    style={{
      backgroundColor: 'var(--color-accent)',
      color: 'white',
      padding: 10,
      marginTop: 20,
      border: 'none',
      borderRadius: 6,
      width: '100%',
      fontWeight: 'bold'
    }}
  >
    Crear crédito
  </button>
)}

    </div>
  );
};

export default CreditSimulator;
