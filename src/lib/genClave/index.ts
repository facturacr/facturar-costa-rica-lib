import { ClaveOpts, Clave, ClaveFecha, Consecutivo } from './interfaces'
import { FrontEndRequest, FinalMessagePerson } from '../../types/globalInterfaces'
import { tipoDocumento } from '../../data/tipoDocumento'

const DEFAULT_VALUES = {
  tipoDocumento: '01',
  tipoIdentificacion: '01',
  codigoPais: '506'
}

function getConsecutivo(opts: ClaveOpts): Consecutivo {
  const typeDocument = tipoDocumento[opts.tipoDocumento]
  const codeDocument = typeDocument ? typeDocument.code : DEFAULT_VALUES.tipoDocumento
  return {
    sucursal: opts.sucursal || '001',
    terminal: opts.terminal || '00001',
    tipoDocumento: codeDocument,
    consecutivo: opts.consecutivo
  }
}

function getSender(frontEndRequest: FrontEndRequest): FinalMessagePerson {
  const sender = frontEndRequest.Emisor
  return {
    tipoIdentificacion: sender.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion,
    numeroIdentificacion: sender.Identificacion.Numero
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

function getCountryCode(code: string): string {
  if (!code || !code.length) {
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
    codigoSeguridad: opts.codigoSeguridad.padStart(8, '0')
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

export default function genClave(opts: ClaveOpts): string {
  const claveObj = genClaveObj(opts)
  return genString(claveObj)
}

export function stringToClave(claveStr: string): Clave {
  return {
    codigoPais: claveStr.slice(0, 3),
    fecha: {
      dia: claveStr.slice(3, 5),
      mes: claveStr.slice(5, 7),
      ano: claveStr.slice(7, 9)
    },
    cedulaEmisor: claveStr.slice(9, 21),
    consecutivo: {
      sucursal: claveStr.slice(21, 24),
      terminal: claveStr.slice(24, 29),
      tipoDocumento: claveStr.slice(29, 31),
      consecutivo: claveStr.slice(31, 41)
    },
    situacionCE: claveStr.slice(41, 42),
    codigoSeguridad: claveStr.slice(42, 51)
  }
}

export function parseOptions(frontEndRequest: FrontEndRequest): ClaveOpts {
  const sender = getSender(frontEndRequest)
  return {
    cedulaEmisor: sender.numeroIdentificacion,
    codigoPais: frontEndRequest.codigoPais,
    codigoSeguridad: frontEndRequest.codigoSeguridad,
    consecutivo: frontEndRequest.consecutivo,
    situacionCE: frontEndRequest.situationEC,
    sucursal: frontEndRequest.sucursal,
    terminal: frontEndRequest.terminal,
    tipoCedula: sender.tipoIdentificacion,
    tipoDocumento: frontEndRequest.tipoDocumento
  }
}

export function getClave(frontEndRequest: FrontEndRequest): string {
  const claveOptions = parseOptions(frontEndRequest)
  return genClave(claveOptions)
}

/*
 * https://blog.hulipractice.com/que-es-y-como-funciona-la-clave-numerica-en-la-factura-electronica-de-costa-rica/
 */

// https://github.com/CRLibre/API_Hacienda/blob/0e4256a5ade4be91b22d7844af48ed4a0ff6eb6f/api/contrib/clave/clave.php
