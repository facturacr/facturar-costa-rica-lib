import { ClientPayload } from '@src/types/globalInterfaces'
import debitNote from '@src/debitNote'
import getToken from '@src/services/getToken'
import requestStub from '@test/stubs/frontendRequest.stub'
import fs from 'fs'

const frontEndRequest: ClientPayload = requestStub
const USERNAME_TEST = process.env.USERNAME_TEST
const PASSWORD_TEST = process.env.PASSWORD_TEST
const SOURCE_P12_URI = process.env.SOURCE_P12_URI
const SOURCE_P12_PASSPORT = process.env.SOURCE_P12_PASSPORT
// @ts-expect-error migration - for example purposes
const pem = fs.readFileSync(SOURCE_P12_URI, 'binary')

async function main(): Promise<void> {
  const tokenObj = await getToken({
    client_id: 'api-stag', // eslint-disable-line
    client_secret: '', // eslint-disable-line
    grant_type: 'password', // eslint-disable-line
    username: USERNAME_TEST,
    password: PASSWORD_TEST
  })
  const token = tokenObj.data.access_token
  const xmlOpt = {
    buffer: pem,
    password: SOURCE_P12_PASSPORT,
    base64: false
  }
  const data = await debitNote({
    token,
    frontEndRequest,
    // @ts-expect-error migration - for example purposes
    xmlOpt
  })
  console.log(typeof data)
  if (data) {
    console.log(data)
  }
}

main()
