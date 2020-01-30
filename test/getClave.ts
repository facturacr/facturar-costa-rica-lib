import genClave from '../src/lib/genClave'
import { ClaveOpts } from '../src/lib/genClave/interfaces'

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
console.log('Clave largo', result.length === 50)
