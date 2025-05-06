import React, { useState, useEffect } from 'react';
import api from '../api/axios';

interface Props {
  documentNumber?: string;
  onClientRegistered?: (client: any) => void;
}

const ClientRegisterForm: React.FC<Props> = ({ documentNumber = '', onClientRegistered }) => {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    phone_number: '',
    document_type_id: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/document-types').then(res => setDocumentTypes(res.data));
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.name || !form.document_type_id) {
      return setError('Faltan campos obligatorios');
    }

    try {
      const res = await api.post('/clients', {
        ...form,
        document_number: documentNumber
      });
      if (onClientRegistered) onClientRegistered(res.data);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h4>Registrar nuevo cliente</h4>
      <select name="document_type_id" onChange={handleChange}>
        <option value="">Tipo de documento</option>
        {documentTypes.map((dt: any) => (
          <option key={dt.id} value={dt.id}>{dt.name}</option>
        ))}
      </select>
      <input name="name" placeholder="Nombre completo" onChange={handleChange} />
      <input name="email" placeholder="Correo" onChange={handleChange} />
      <input name="address" placeholder="Dirección" onChange={handleChange} />
      <input name="phone_number" placeholder="Teléfono" onChange={handleChange} />
      <button onClick={handleRegister}>Registrar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ClientRegisterForm;
