import { PersonProps } from '@src/ATV/core/Person'
import { DocumentNames } from '@src/ATV/core/documentNames.types'
import { InvoiceDocumentContainer } from '@src/types/facturaInterfaces';
import { Method } from 'axios'

type PersonInput = PersonProps;

type TaxInput = {
  code: string;
  rateCode: string;
  rate: number;
  amount?: number;
}

type OrderInput = {
  detail: string;
  unitaryPrice: number;
  lineNumber?: string;
  code?: string;
  quantity?: number;
  measureUnit?: string;
  totalAmount?: number;
  subTotal?: number;
  tax?: TaxInput;
  totalOrderLineAmount?: number;
}

export type DocumentTypes = 'FE'

type DocumentInput = {
  emitter: PersonInput;
  receiver: PersonInput;
  branch: string; // sucursal
  terminal: string; // terminal
  // documentType: DocumentTypes; // @deprecated
  documentName: DocumentNames;
  countryCode: string; // codigoPais
  securityCode: string; // codigoSeguridad
  activityCode: string;
  consecutiveIdentifier: string; // consecutivo
  ceSituation: string; // situacionCE
  orderLines: OrderInput[];
}

export type CreateDocumentInput = {
  document: DocumentInput;
  token: string;
  signatureOptions: {
    buffer: string;
    password: string;
  };
}

export type Command = {
  url: string;
  method: Method;
  data: {
    clave: string;
    fecha: string;
    emisor: {
      tipoIdentificacion: string;
      numeroIdentificacion: string;
    };
    receptor: {
      tipoIdentificacion: string;
      numeroIdentificacion: string;
    };
    comprobanteXml: string;
  };
  headers: {
    Authorization: string;
    'Content-Type': string;
  };
}

export type CreateAndSendDocumentResponse = {
  command: Command;
  extraData: {
    xml: string;
    document: InvoiceDocumentContainer;
  };
}
