import genClave from '../src/lib/genClave'
import { ClaveOpts } from '../src/lib/genClave/interfaces'

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

const clave: ClaveOpts = {
  codigoPais: '506',
  tipoDocumento: 'FE',
  tipoCedula: '1',
  cedulaEmisor: '504130864',
  situacionCE: '1',
  consecutivo: '0000000001',
  codigoSeguridad: '',
  sucursal: '001',
  terminal: '00001'
}

const result = genClave(clave)
console.log('Clave', result)
console.log('Clave largo', result.length)
