import { Persona, LineaDetalle } from './facturaInterfaces'

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

interface FinalMessagePerson {
  tipoIdentificacion: string;
  numeroIdentificacion: string;
}

interface FinalMessage {
  clave: string;
  fecha: string;
  emisor: FinalMessagePerson;
  receptor: FinalMessagePerson;
  comprobanteXML: string;
}

type XmlOpt = {
  buffer: string;
  password: string;
  base64: boolean;
}
