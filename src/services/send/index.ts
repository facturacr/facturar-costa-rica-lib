import axios from 'axios'

const MAIN_DOMAIN = 'https://api.comprobanteselectronicos.go.cr/'
const RUT = (process.env.IS_STG) ? 'recepcion-sandbox' : 'recepcion'
const PATH = `${RUT}/v1/recepcion/`

const URL = MAIN_DOMAIN + PATH

export function send(token: string, postOptions: any): Record<string, any> {
  return axios({
    url: URL,
    method: 'post',
    data: postOptions,
    headers: {
      Authorization: 'bearer ' + token,
      'Content-Type': 'application/json'
    }
  })
}

export function sendToCustomURL(token: string, url: string): Record<string, any> {
  return axios({
    url: url,
    method: 'get',
    headers: {
      Authorization: 'bearer ' + token,
      'Content-Type': 'application/json'
    }
  })
}

/*
 * https://www.hacienda.go.cr/docs/5d16ade309fe0_Guia_IdP.pdf
 * https://www.hacienda.go.cr/ATV/ComprobanteElectronico/docs/esquemas/2016/v4.2/comprobantes-electronicos-api.html#
 */
