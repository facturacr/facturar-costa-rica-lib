export type Mode = 'prod' | 'stg' | 'custom';

export type ATVOptions = {
  defaultOverwrites?: {
    tokenServiceUrl: string;
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

export type SendConfirmationInput = {
  url: string;
  headers: {
    Authorization: string;
    'Content-Type': string;
  };
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
