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

export interface ClaveFecha { // 06 length
  dia: string; // 02 lenght
  mes: string; // 02 lenght
  ano: string; // 02 lenght
}

export interface Consecutivo { // 20 lenght
  sucursal: string; // 03 length
  terminal: string; // 05 length
  tipoDocumento: string; // 02 length
  consecutivo: string; // 10 length
}

export interface Clave { // 50 lenght
  codigoPais: string; // 03 length
  fecha: ClaveFecha; // 06 length
  cedulaEmisor: string; // 12 length
  consecutivo: Consecutivo; // 20 lenght
  situacionCE: string; // 1 lenght
  codigoSeguridad: string; // 08 length
}
