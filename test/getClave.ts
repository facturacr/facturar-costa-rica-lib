import genClave from '../src/lib/genClave'


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
  tipoDocumento: 'FE2',
  tipoCedula: '1',
  cedulaEmisor: '504130864',
  situacionCE: 'E1',
  consecutivo: '21',
  codigoSeguridad: '',
  sucursal: '001',
  terminal: '0001'
};

const result = genClave(clave);
console.log('Your clave is', result);
