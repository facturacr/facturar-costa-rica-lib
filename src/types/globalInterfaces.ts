import { Persona, LineaDetalle } from '@src/types/facturaInterfaces'

export interface ClientPayload {
  Emisor: Persona;
  Receptor: Persona;
  sucursal?: string;
  terminal?: string;
  tipoDocumento?: string;
  codigoPais?: string;
  codigoSeguridad: string;
  consecutivo: string;
  situationEC: string;
  actividad: string;
  total?: number; // deprecated
  impuesto?: number; // deprecated
  LineasDetalle: Array<LineaDetalle>;
  facturaElectronicaType?: 'FacturaElectronica' | 'FacturaElectronicaExportacion';
}

export interface ClaveOpts {
  codigoPais: string;
  tipoDocumento: string;
  tipoCedula: string;
  cedulaEmisor: string;
  situacionCE: string;
  consecutivo: string;
  codigoSeguridad: string;
  sucursal: string;
  terminal: string;
}

export interface FinalMessagePerson {
  tipoIdentificacion: string;
  numeroIdentificacion: string;
}

export interface FinalMessage {
  clave: string;
  fecha: string;
  emisor: FinalMessagePerson;
  receptor: FinalMessagePerson;
  comprobanteXML: string;
}

export type XmlOpt = {
  buffer: string;
  password: string;
  base64: boolean;
}
