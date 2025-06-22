import { InvoiceDocumentContainer } from '@src/types/facturaInterfaces'
import { Method } from 'axios'

export type DocumentTypes = 'FE'

type CommandData = {
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
  consecutivoReceptor?: string;
};

export type Command = {
  url: string;
  method: Method;
  data: CommandData;
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
