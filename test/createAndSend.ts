import { FrontEndRequest } from '../src/types/globalInterfaces'
import getToken from '../src/services/getToken'
import fe from './input/frontendRequest'
import send from '../src'
import fs from 'fs'

const IS_STG = process.env.IS_STG
const USERNAME_TEST = process.env.USERNAME_TEST
const PASSWORD_TEST = process.env.PASSWORD_TEST
console.log('process.env.IS_STG', IS_STG)

const SOURCE_P12_URI = process.env.SOURCE_P12_URI
const SOURCE_P12_PASSPORT = process.env.SOURCE_P12_PASSPORT
const pem = fs.readFileSync(SOURCE_P12_URI, 'binary')

const frontEndRequest: FrontEndRequest = fe

async function main(): Promise<void> {
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
  if (data) {
    console.log(data.statusText)
  }
}

main()
