import { FrontEndRequest } from '../src/types/globalInterfaces'
import confirmXML from '../src/confirmXML'
import getToken from '../src/services/getToken'
import fs from 'fs'

const IS_STG = process.env.IS_STG
const USERNAME_TEST = process.env.USERNAME_TEST
const PASSWORD_TEST = process.env.PASSWORD_TEST
console.log('process.env.IS_STG', IS_STG)

const SOURCE_P12_URI = process.env.SOURCE_P12_URI
const SOURCE_P12_PASSPORT = process.env.SOURCE_P12_PASSPORT
const XML_TO_CONFIRM = process.env.XML_TO_CONFIRM
const pem = fs.readFileSync(SOURCE_P12_URI, 'binary')
const xml = fs.readFileSync(XML_TO_CONFIRM, 'utf-8')

async function main(): Promise<void> {
  const token = await getToken({
    client_id: 'api-stag', // eslint-disable-line
    client_secret: '', // eslint-disable-line
    grant_type: 'password', // eslint-disable-line
    username: USERNAME_TEST,
    password: PASSWORD_TEST
  })
  confirmXML(token, xml)
}

main()
