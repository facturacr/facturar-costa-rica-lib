import axios from 'axios'
import qs from 'querystring'

const MAIN_DOMAIN = 'https://idp.comprobanteselectronicos.go.cr'
const STG_PATH = '/auth/realms/rut-stag/protocol/openid-connect/token'
const PROD_PATH = '/auth/realms/rut/protocol/openid-connect/token'
const PATH = (process.env.IS_STG) ? STG_PATH : PROD_PATH
const TOKEN_URL = MAIN_DOMAIN + PATH

type IPostTokenOptions = {
  client_id: String, // eslint-disable-line camelcase
  grant_type: String, // eslint-disable-line camelcase
  client_secret?: String, // eslint-disable-line camelcase
  username?: String,
  password?: String
}

export default (postOptions: IPostTokenOptions) => {
  return axios.post(TOKEN_URL, qs.stringify(postOptions), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/*
 * https://www.hacienda.go.cr/docs/5d16ade309fe0_Guia_IdP.pdf
 *
 */
