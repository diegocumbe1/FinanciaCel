import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

interface Props {
  documentNumber?: string;
  onClientRegistered?: (client: any) => void;
}

const ClientRegisterForm: React.FC<Props> = ({ documentNumber = '', onClientRegistered }) => {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [form, setForm] = useState({
    document_number: documentNumber,
    name: '',
    email: '',
    address: '',
    phone_number: '',
    document_type_id: '',
  });
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/document-types').then(res => setDocumentTypes(res.data));
  }, []);

  useEffect(() => {
    setForm(f => ({ ...f, document_number: documentNumber }));
  }, [documentNumber]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.name || !form.document_type_id || !form.document_number) {
      return setError('Faltan campos obligatorios');
    }
    try {
      const res = await api.post('/clients', form);
      setToast('Cliente registrado exitosamente');
      setTimeout(() => {
        setToast('');
        navigate(`/clientes/${res.data.id}`);
      }, 1500);
      if (onClientRegistered) onClientRegistered(res.data);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <div style={{
      maxWidth: 600,
      margin: '40px auto',
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
      padding: 32,
      position: 'relative'
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
        }}>{toast}</div>
      )}
      <h2 style={{ color: 'var(--color-primary)', marginBottom: 24 }}>Registrar nuevo cliente</h2>
      <form
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20
        }}
        onSubmit={handleRegister}
        autoComplete="off"
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: 6, fontWeight: 500 }}>Tipo de documento</label>
          <select
            name="document_type_id"
            onChange={handleChange}
            value={form.document_type_id}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 15 }}
          >
            <option value="">Seleccione</option>
            {documentTypes.map((dt: any) => (
              <option key={dt.id} value={dt.id}>{dt.name}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: 6, fontWeight: 500 }}>Número de documento</label>
          <input
            name="document_number"
            placeholder="Número de documento"
            value={form.document_number}
            onChange={handleChange}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 15 }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: 6, fontWeight: 500 }}>Nombre completo</label>
          <input
            name="name"
            placeholder="Nombre completo"
            value={form.name}
            onChange={handleChange}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 15 }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: 6, fontWeight: 500 }}>Correo</label>
          <input
            name="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 15 }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: 6, fontWeight: 500 }}>Dirección</label>
          <input
            name="address"
            placeholder="Dirección"
            value={form.address}
            onChange={handleChange}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 15 }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: 6, fontWeight: 500 }}>Teléfono</label>
          <input
            name="phone_number"
            placeholder="Teléfono"
            value={form.phone_number}
            onChange={handleChange}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 15 }}
          />
        </div>
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: 10 }}>
          <button
            type="submit"
            style={{
              padding: '12px 32px',
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            Registrar
          </button>
        </div>
      </form>
      {error && <p style={{ color: 'red', marginTop: 18, textAlign: 'center' }}>{error}</p>}
    </div>
  );
};

export default ClientRegisterForm;
