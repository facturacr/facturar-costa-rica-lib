import { ClaveOpts } from './interfaces'
import { tipoDocumento } from '../data/tipoDocumento'
// import { tipoCedula } from '../data/tipoCedula'

function getConsecutivo(opts: ClaveOpts): string {
  const codigoDocumento = tipoDocumento[opts.tipoDocumento]
  return opts.sucursal + opts.terminal + codigoDocumento + opts.consecutivo
}

function getDateInfo(date: Date): string {
  const day = date.getDay().toString().padStart(2, '0')
  const month = date.getMonth().toString().padStart(2, '0')
  const year = date.getFullYear() - 2000
  return day + month + year
}

export default (opts: ClaveOpts): string => {
  const today = new Date()
  const clave = {
    codigoPais: opts.codigoPais.padStart(3, '0') || '506',
    fecha: getDateInfo(today),
    cedulaEmisor: opts.cedulaEmisor,
    consecutivoFinal: getConsecutivo(opts),
    situacion: opts.situacionCE,
    codigoSeguridad: opts.codigoSeguridad
  }
  return Object.values(clave).join('')
}

/*
 * https://blog.hulipractice.com/que-es-y-como-funciona-la-clave-numerica-en-la-factura-electronica-de-costa-rica/
 */

// https://github.com/CRLibre/API_Hacienda/blob/0e4256a5ade4be91b22d7844af48ed4a0ff6eb6f/api/contrib/clave/clave.php
