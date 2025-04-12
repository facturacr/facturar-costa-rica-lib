import fs from 'fs'
import { createDocumentInputExample } from '@test/stubs/createDocument.data'
import { ATV } from '../dist/src'
import { PersonProps } from 'dist/src/ATV/core/Person'


const IS_STG = process.env.IS_STG
const USERNAME_TEST = process.env.USERNAME_TEST
const PASSWORD_TEST = process.env.PASSWORD_TEST

const SOURCE_P12_URI = process.env.SOURCE_P12_URI
const SOURCE_P12_PASSPORT = process.env.SOURCE_P12_PASSPORT

if (!SOURCE_P12_PASSPORT || !SOURCE_P12_URI) {
  throw new Error('No environment. For running examples set .env before.')
}

const pem = fs.readFileSync(SOURCE_P12_URI, 'binary')

const paramConsecutive = process.argv[2]
console.log('paramConsecutive', paramConsecutive)

// TODO: dynamic param --identifier 1 args[x]
createDocumentInputExample.consecutiveIdentifier = paramConsecutive || process.env.TEST_CONSECUTIVE
createDocumentInputExample.emitter.identifier.id = process.env.EMITTER_IDENTIFIER_ID as string
createDocumentInputExample.emitter.identifier.type = process.env.EMITTER_IDENTIFIER_TYPE as PersonProps['identifier']['type']

console.log('requestStub consecutivo', createDocumentInputExample.consecutiveIdentifier)

function getConfimation(atv: ATV, token: string, location: string, ms: number): Promise<any> {
  return new Promise((resolve, reject): any => {
    setTimeout(() => {
      console.log('location', location)
      atv.sendConfirmation({
        url: location,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + token
        }
      }).then(data => resolve(data))
        .catch(err => reject(err))
    }, ms)
  })
}

async function main(): Promise<void> {
  const atv = new ATV({}, 'stg')
  const tokenData = await atv.getToken({
    username: USERNAME_TEST,
    password: PASSWORD_TEST
  })
  const { command, extraData } = await atv.createDocumentCommand({
    document: createDocumentInputExample,
    token: tokenData.accessToken,
    signatureOptions: {
      buffer: pem,
      password: SOURCE_P12_PASSPORT
    }
  })
  console.log('extraData', extraData)
  const response = await atv.sendDocument(command)
  if (response.errorCause) {
    console.log('error response', response)
    return
  }
  const confirmationResponse = await getConfimation(atv, tokenData.accessToken, response.location, 2000)
  console.log({ MensajeHacienda: confirmationResponse.confirmation })
}

main()
