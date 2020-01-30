import { Persona } from '../facturaInterfaces'
export interface FrontEndRequest {
  Emisor: Persona;
  Receptor: Persona;
  sucursal: string;
  terminal: string;
  tipoDocumento: string;
  codigoPais: string;
  codigoSeguridad: string;
  consecutivo: string;
  situationEC: string;
  actividad: number;
  total: number;
  impuesto: number;
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
