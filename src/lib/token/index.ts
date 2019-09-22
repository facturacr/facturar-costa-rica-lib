// https://www.hacienda.go.cr/docs/5d16ade309fe0_Guia_IdP.pdf
import axios from 'axios'

const MAIN_DOMAIN = 'https://idp.comprobanteselectronicos.go.cr'
const STG_PATH = '/auth/realms/rut-stag/protocol/openid-connect/token'
const PROD_PATH = '/auth/realms/rut/protocol/openid-connect/token'
const PATH = (process.env.IS_STG) ? STG_PATH : PROD_PATH
const TOKEN_URL = MAIN_DOMAIN + PATH

const postOptionsWithPass = {
  client_id: '',
  client_secret: '',
  grant_type: '',
  username: '',
  password: ''
}

// TODO: refresh token options

axios.post(TOKEN_URL, postOptionsWithPass, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
