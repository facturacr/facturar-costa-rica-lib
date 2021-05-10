import { FrontEndRequest } from '@src/types/globalInterfaces'
import requestStub from '@test/stubs/frontendRequest.stub'
import send from '@src/electronicBill'
import getToken from '@src/services/getToken'
import { sendToCustomURL } from '@src/services/send/index'
import fs from 'fs'

const IS_STG = process.env.IS_STG
const USERNAME_TEST = process.env.USERNAME_TEST
const PASSWORD_TEST = process.env.PASSWORD_TEST
console.log('process.env.IS_STG', IS_STG)

const SOURCE_P12_URI = process.env.SOURCE_P12_URI
const SOURCE_P12_PASSPORT = process.env.SOURCE_P12_PASSPORT

if (!SOURCE_P12_PASSPORT || !SOURCE_P12_URI) {
  throw new Error('No environment. For running examples set .env before.')
}

const pem = fs.readFileSync(SOURCE_P12_URI, 'binary')

const frontEndRequest: FrontEndRequest = requestStub

console.log('requestStub', requestStub.consecutivo)

function decodeBase64(encodedStr: string): string {
  const buff = Buffer.from(encodedStr, 'base64')
  return buff.toString('ascii')
}

function getConfimation(token: string, data: any, ms: number): Promise<any> {
  return new Promise((resolve, reject): any => {
    setTimeout(() => {
      const location = data.headers.location
      console.log('location', location)
      sendToCustomURL(token, location)
        .then(data => resolve(data))
        .catch(err => reject(err))
    }, ms)
  })
}

async function main(): Promise<void> {
  const tokenObj = await getToken({
    client_id: 'api-stag', // eslint-disable-line
    client_secret: '', // eslint-disable-line
    grant_type: 'password', // eslint-disable-line
    username: USERNAME_TEST,
    password: PASSWORD_TEST
  })
  const token = tokenObj.data.access_token
  const data = await send(token, frontEndRequest, {
    buffer: pem,
    password: SOURCE_P12_PASSPORT
  })
  if (data) {
    const secondResponse = await getConfimation(token, data, 5000)
      .catch(err => {
        const response = err.response || {}
        console.log('response', response)
      })
    const XMLResponse = secondResponse.data['respuesta-xml']
    if (!XMLResponse) {
      const state = secondResponse.data['ind-estado']
      console.log('state', state)
      return
    }
    const text = decodeBase64(XMLResponse)
    console.log('secondResponse', text)
  }
}

main()
