import { ClaveOpts } from './interfaces'
import { tipoDocumento } from '../data/tipoDocumento'
// import { tipoCedula } from '../data/tipoCedula'

const DEFAULT_VALUES = {
  tipoDocumento: '01',
  codigoPais: '506'
}

function getConsecutivo(opts: ClaveOpts): string {
  const typeDocument = tipoDocumento[opts.tipoDocumento]
  const codeDocument = typeDocument ? typeDocument.code : DEFAULT_VALUES.tipoDocumento
  return opts.sucursal + opts.terminal + codeDocument + opts.consecutivo
}

function getDateInfo(date: Date): string {
  const day = date.getDay().toString().padStart(2, '0')
  const month = date.getMonth().toString().padStart(2, '0')
  const year = date.getFullYear() - 2000
  return day + month + year
}

function getSecurityCode(): string {
  const securityCodeLength = Number(process.env.SECURITY_CODE_LENGTH)
  const ramdom = Math.floor(Math.random() * securityCodeLength);
  return ramdom.toString()
}

function getCountryCode(code: string): string {
  if(code || !code.length) {
    return DEFAULT_VALUES.codigoPais
  }
  return code.padStart(3, '0');
}

export default (opts: ClaveOpts): string => {
  const today = new Date()
  const clave = {
    codigoPais: getCountryCode(opts.codigoPais),
    fecha: getDateInfo(today),
    cedulaEmisor: opts.cedulaEmisor,
    consecutivoFinal: getConsecutivo(opts),
    situacion: opts.situacionCE,
    codigoSeguridad: getSecurityCode(),
  }
  return Object.values(clave).join('')
}

/*
 * https://blog.hulipractice.com/que-es-y-como-funciona-la-clave-numerica-en-la-factura-electronica-de-costa-rica/
 */

// https://github.com/CRLibre/API_Hacienda/blob/0e4256a5ade4be91b22d7844af48ed4a0ff6eb6f/api/contrib/clave/clave.php
