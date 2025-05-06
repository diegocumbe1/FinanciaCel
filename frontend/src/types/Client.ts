export interface Client {
  id: string;
  name: string;
  email?: string;
  document: string;
  document_type_id: string;
  address?: string;
  phone_number?: string;
  credit_applications?: any[];
} 