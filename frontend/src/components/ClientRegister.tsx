import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ClientDetails from './ClientDetails';
import { Client } from '../types/Client';

interface DocumentType {
    id: string;
    name: string;
}

const ClientRegister: React.FC<{ onClientSelected: (client: Client) => void }> = ({ onClientSelected }) => {
    const [document_number, setDocumentNumber] = useState('');
    const [document_type_id, setDocumentTypeId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [foundClient, setFoundClient] = useState<Client | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);

    useEffect(() => {
        api.get('/document-types').then(res => {
            setDocumentTypes(res.data);
        });
    }, []);

    const searchClient = async () => {
        setError('');
        setSuccess('');
        if (!document_number) return setError('Ingresa un número de documento');

        try {
            const response = await api.get(`/clients`, { params: { document: document_number } });
            const client = response.data?.data?.[0];

            if (client) {
                const fullClient = await api.get(`/clients/${client.id}`);
                const detailedClient = fullClient.data.data;
                const unifiedClient: Client = {
                    ...detailedClient,
                    document: detailedClient.document_number,
                };
                setFoundClient(unifiedClient);
                setName(unifiedClient.name);
                setEmail(unifiedClient.email || '');
                setAddress(unifiedClient.address || '');
                setPhoneNumber(unifiedClient.phone_number || '');
                setDocumentTypeId(unifiedClient.document_type_id);
                onClientSelected(unifiedClient);
                setSuccess('Cliente encontrado');
              }
               else {
                setFoundClient(null);
            }
        } catch (e: any) {
            if (e.response?.status === 404) {
                setError('Cliente no encontrado por número de documento.');
                setFoundClient(null);
            } else {
                setError('Error al buscar cliente.');
            }
        }
    };

    const registerClient = async () => {
        setError('');
        setSuccess('');

        if (!name || !document_type_id || !document_number) {
            return setError('Todos los campos requeridos deben ser llenados');
        }

        try {
            const response = await api.post('/clients', {
                name,
                document_number,
                email,
                address,
                phone_number,
                document_type_id
            });
            const unifiedClient: Client = {
                ...response.data,
                document: response.data.document_number,
            };
            setFoundClient(unifiedClient);
            onClientSelected(unifiedClient);
            setSuccess('Cliente registrado exitosamente');
        } catch (e: any) {
            if (e.response?.data?.message) {
                setError(e.response.data.message); // Mensaje del backend
            } else {
                setError('No se pudo registrar el cliente');
            }
            console.error('Error al registrar cliente:', e.response || e);
        }
    };


    return (
        <div>
            <h2 style={{ color: 'var(--color-primary)' }}>Buscar o Registrar Cliente</h2>

            <div style={{ marginBottom: 12 }}>
                <input
                    type="text"
                    placeholder="Número de documento"
                    value={document_number}
                    onChange={e => setDocumentNumber(e.target.value)}
                />
                <button onClick={searchClient}>Buscar</button>
            </div>

            {!foundClient && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <select
                            value={document_type_id}
                            onChange={e => setDocumentTypeId(e.target.value)}
                            required
                        >
                            <option value="">Tipo de documento</option>
                            {documentTypes.map(dt => (
                                <option key={dt.id} value={dt.id}>{dt.name}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Nombre completo"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <input
                            type="text"
                            placeholder="Dirección"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Teléfono"
                            value={phone_number}
                            onChange={e => setPhoneNumber(e.target.value)}
                        />
                        <button onClick={registerClient}>Registrar</button>
                    </div>
                </div>
            )}

            {success && (
                <>
                    <p style={{ color: 'green' }}>{success}</p>
                    {foundClient && <ClientDetails client={foundClient} />}
                </>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ClientRegister;
