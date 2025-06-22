import { PersonProps } from '@src/ATV/core/Person'
import { InvoiceDocumentContainer } from '@src/types/facturaInterfaces'
import { Method } from 'axios'

export type DocumentTypes = 'FE'

type CommandData = {
  clave: string;
  fecha: string;
  emisor: {
    tipoIdentificacion: PersonProps['identifier']['type'];
    numeroIdentificacion: string;
  };
  receptor?: {
    tipoIdentificacion: PersonProps['identifier']['type'];
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
