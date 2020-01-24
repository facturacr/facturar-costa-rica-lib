import genJSON from '../src/lib/genJSON'
import { FrontEndRequest } from '../src/lib/genJSON/interfaces'

const frontEndRequest: FrontEndRequest = {
  senderID: '3102192375',
  receiverId: '3102192375',
  sale: '001',
  terminal: '00001',
  typeDocument: 'FE',
  countryCode: '506',
  consecutive: '0000000001',
  securityCode: '',
  situationEC: '1',
  total: 904000,
  tax: 10
}

const XML = genJSON(frontEndRequest)
console.log('XML', XML)
