import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ClientDetails from '../components/ClientDetails';
import ClientRegisterForm from '../components/ClientRegisterForm';
import ClientList from './ClientList';

const ClientPage: React.FC = () => {
  const { id } = useParams();
  const [client, setClient] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchClientById(id);
    } else {
      setClient(null);
    }
  }, [id]);

  const fetchClientById = async (clientId: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/clients/${clientId}`);
      setClient({ ...res.data.data, document: res.data.data.document_number });
    } catch (e) {
      setError('No se pudo cargar el cliente');
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    if (loading) return <p>Cargando cliente...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!client) return <p>No se encontró el cliente.</p>;
    return <ClientDetails client={client} onUpdate={setClient} />;
  }

  // Solo muestra la lista y el botón si no hay id
  return (
    <div>
      <h2 style={{ color: 'var(--color-primary)' }}>Clientes</h2>
      <button
        onClick={() => navigate('/registrar-cliente')}
        style={{ margin: '16px 0', padding: '12px 24px', fontSize: 18, background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 6 }}
      >
        Registrar nuevo cliente
      </button>
      <ClientList />
    </div>
  );
};

export default ClientPage;
