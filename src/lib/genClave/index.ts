import { ClaveOpts, Clave, ClaveFecha, Consecutivo } from './interfaces'
import { tipoDocumento } from '../../data/tipoDocumento'
// import { tipoCedula } from '../data/tipoCedula'

const DEFAULT_VALUES = {
  tipoDocumento: '01',
  codigoPais: '506'
}

function getConsecutivo(opts: ClaveOpts): Consecutivo {
  const typeDocument = tipoDocumento[opts.tipoDocumento]
  const codeDocument = typeDocument ? typeDocument.code : DEFAULT_VALUES.tipoDocumento
  return {
    sucursal: opts.sucursal,
    terminal: opts.terminal,
    tipoDocumento: codeDocument,
    consecutivo: opts.consecutivo
  }
}

function getDateInfo(date: Date): ClaveFecha {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear() - 2000
  return {
    dia: day,
    mes: month,
    ano: year.toString()
  }
}

function getRandomSecurityCode(): string {
  const securityCodeLength = Number(8)
  const random = Math.floor(Math.random() * securityCodeLength)
  return random.toString().padStart(8, '0')
}

function getCountryCode(code: string): string {
  if (code || !code.length) {
    return DEFAULT_VALUES.codigoPais
  }
  return code.padStart(3, '0')
}

function getIssuerCard(issuerCard: string): string {
  return issuerCard.padStart(12, '0')
}

export function genClaveObj(opts: ClaveOpts): Clave {
  const today = new Date()
  return {
    codigoPais: getCountryCode(opts.codigoPais),
    fecha: getDateInfo(today),
    cedulaEmisor: getIssuerCard(opts.cedulaEmisor),
    consecutivo: getConsecutivo(opts),
    situacionCE: opts.situacionCE,
    codigoSeguridad: opts.codigoSeguridad.padStart(8, '0') || getRandomSecurityCode()
  }
}

export function genString(claveObj: Clave): string {
  const clave = {
    codigoPais: claveObj.codigoPais,
    fecha: Object.values(claveObj.fecha).join(''),
    cedulaEmisor: claveObj.cedulaEmisor,
    consecutivo: Object.values(claveObj.consecutivo).join(''),
    situacionCE: claveObj.situacionCE,
    codigoSeguridad: claveObj.codigoSeguridad
  }
  return Object.values(clave).join('')
}

export default (opts: ClaveOpts): string => {
  const claveObj = genClaveObj(opts)
  return genString(claveObj)
}

/*
 * https://blog.hulipractice.com/que-es-y-como-funciona-la-clave-numerica-en-la-factura-electronica-de-costa-rica/
 */

// https://github.com/CRLibre/API_Hacienda/blob/0e4256a5ade4be91b22d7844af48ed4a0ff6eb6f/api/contrib/clave/clave.php
