import axios from 'axios'
import qs from 'querystring'

const MAIN_DOMAIN = 'https://api.comprobanteselectronicos.go.cr/'
const RUT = (process.env.IS_STG) ? 'recepcion-sandbox' : 'recepcion'
const PATH = `${RUT}/v1/recepcion/`

const URL = MAIN_DOMAIN + PATH

export default (token: string, postOptions: any): Record<string, any> => {
  console.log('postOptions', postOptions)
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

/*
 * https://www.hacienda.go.cr/docs/5d16ade309fe0_Guia_IdP.pdf
 */
