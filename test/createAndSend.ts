import getToken from '../src/services/getToken'
import { FrontEndRequest } from '../src/lib/genJSON/interfaces'
import send from '../src'
import fs from 'fs'

const IS_STG = process.env.IS_STG
const USERNAME_TEST = process.env.USERNAME_TEST
const PASSWORD_TEST = process.env.PASSWORD_TEST
console.log('process.env.IS_STG', IS_STG)

const SOURCE_P12_URI = process.env.SOURCE_P12_URI
const SOURCE_P12_PASSPORT = process.env.SOURCE_P12_PASSPORT
const pem = fs.readFileSync(SOURCE_P12_URI, 'binary')

const frontEndRequest: FrontEndRequest = {
  senderID: '003102759157',
  receiverId: '00206920142',
  sale: '001',
  terminal: '00001',
  typeDocument: 'FE',
  countryCode: '506',
  consecutive: '0000000042',
  securityCode: '',
  situationEC: '1',
  total: 904000,
  tax: 10
}

async function main() {
  const token = await getToken({
    client_id: 'api-stag', // eslint-disable-line
    client_secret: '', // eslint-disable-line
    grant_type: 'password', // eslint-disable-line
    username: USERNAME_TEST,
    password: PASSWORD_TEST
  })
  const data = await send(token.data.access_token, frontEndRequest, {
    buffer: pem,
    password: SOURCE_P12_PASSPORT
  })
  console.log(data)
}

main()