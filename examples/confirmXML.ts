import confirmXML from '@src/confirmXML'
import { sendToCustomURL } from '@src/services/send/index'
import getToken from '@src/services/getToken'
import fs from 'fs'

const USERNAME_TEST = process.env.USERNAME_TEST
const PASSWORD_TEST = process.env.PASSWORD_TEST

const SOURCE_P12_URI = process.env.SOURCE_P12_URI
const SOURCE_P12_PASSPORT = process.env.SOURCE_P12_PASSPORT
const XML_TO_CONFIRM = process.env.XML_TO_CONFIRM

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
  try {
    const pem = fs.readFileSync(SOURCE_P12_URI, 'binary')
    const xml = fs.readFileSync(XML_TO_CONFIRM, 'utf-8')
    const token = await getToken({
      client_id: 'api-stag', // eslint-disable-line
      client_secret: '', // eslint-disable-line
      grant_type: 'password', // eslint-disable-line
      username: USERNAME_TEST,
      password: PASSWORD_TEST
    })
    const consecutivo = {
      consecutivo: '0000000013'
    }
    const data = await confirmXML({
      token: token.data.access_token,
      consecutivo,
      xmlStr: xml,
      tipoDocKey: 'CCE',
      pemOpt: {
        buffer: pem,
        password: SOURCE_P12_PASSPORT
      }
    })
    if (data) {
      const secondResponse = await getConfimation(token.data.access_token, data, 10000)
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
    } else {
      console.log('no data', data)
    }
  } catch (error) {
    console.warn(error.code)
  }
}

main()
