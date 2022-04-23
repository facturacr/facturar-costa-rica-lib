import axios from 'axios'
import qs from 'querystring'
import { postTokenOptions } from '@src/services/getToken/interfaces'

const MAIN_DOMAIN = 'https://idp.comprobanteselectronicos.go.cr'
const RUT = (process.env.IS_STG) ? 'rut-stag' : 'rut'
const PATH = `/auth/realms/${RUT}/protocol/openid-connect/token`

const TOKEN_URL = MAIN_DOMAIN + PATH

export default (postOptions: postTokenOptions): Promise<any> => {
  return axios.post(TOKEN_URL, qs.stringify(postOptions), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/*
 * https://www.hacienda.go.cr/docs/5d16ade309fe0_Guia_IdP.pdf
 */
