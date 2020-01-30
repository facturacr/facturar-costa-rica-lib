import fs from 'fs'
import genJSON from '../src/lib/genJSON'
import { FrontEndRequest } from '../src/lib/genJSON/interfaces'

const SOURCE_P12_URI = process.env.SOURCE_P12_URI
const SOURCE_P12_PASSPORT = process.env.SOURCE_P12_PASSPORT
const pem = fs.readFileSync(SOURCE_P12_URI, 'binary')

const frontEndRequest: FrontEndRequest = {
  Emisor: {
    Nombre: '',
    Identificacion: {
      Tipo: '001',
      Numero: '003102759157'
    }
  },
  Receptor: {
    Nombre: '',
    Identificacion: {
      Tipo: '001',
      Numero: '206920142'
    }
  },
  sucursal: '001',
  terminal: '00001',
  tipoDocumento: 'FE',
  codigoPais: '506',
  consecutivo: 1,
  codigoSeguridad: '',
  situationEC: '1',
  total: 904000,
  impuesto: 10,
  actividad: 12121
}

const XML = genJSON(frontEndRequest, {
  buffer: pem,
  password: SOURCE_P12_PASSPORT,
  base64: true
})
console.log('XML', XML)
