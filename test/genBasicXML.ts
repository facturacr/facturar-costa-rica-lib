import fs from 'fs'
import genJSON from '../src/lib/genJSON'
import { FrontEndRequest } from '../src/lib/genJSON/interfaces'

const SOURCE_P12_URI = process.env.SOURCE_P12_URI
const SOURCE_P12_PASSPORT = process.env.SOURCE_P12_PASSPORT
const pem = fs.readFileSync(SOURCE_P12_URI, 'binary')

const frontEndRequest: FrontEndRequest = {
  senderID: '003102759157',
  receiverId: '206920142',
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

const XML = genJSON(frontEndRequest, {
  buffer: pem,
  password: SOURCE_P12_PASSPORT,
  base64: true
})
console.log('XML', XML)
