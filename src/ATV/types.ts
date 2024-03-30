import { Method } from 'axios';

export type Mode = 'prod' | 'stg' | 'custom';

export type ATVOptions = {
  urls?: {
    createDocumentUrl: string;
  };
}

export type TokenServiceProps = {
  serviceUrl: string;
  clientId: string;
}

export type SendResponse = {
  status: number;
  location: string;
  errorCause?: string | null;
}

export type ConfirmationMessage = {
  clave: string;
  message: string;
  details: string;
  emitterFullName: string;
  emitterIdentifierId: string;
  receiverIdentifierId: string;
  taxesTotalAmount: string;
  totalInvoiceAmount: string;
}

export type RequestCommand = {
  url: string;
  method?: Method;
  headers: {
    Authorization: string;
    'Content-Type': 'application/json';
  };
}
