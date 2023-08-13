import fs from 'fs'
import { ATV } from '@src/ATV'
import { createDocumentInputStub } from '@test/stubs/createDocument.stub'

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

console.log('requestStub consecutivo', createDocumentInputStub.consecutiveIdentifier)

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
    document: createDocumentInputStub,
    token: tokenData.accessToken,
    signatureOptions: {
      buffer: pem,
      password: SOURCE_P12_PASSPORT
    }
  })
  console.log('command', command)
  console.log('extraData', extraData)
  const response = await atv.sendDocument(command)
  console.log('response', response)
  if (!response.location) {
    return
  }
  const confirmationResponse = await getConfimation(atv, tokenData.accessToken, response.location, 1000)
  console.log({ MensajeHacienda: confirmationResponse.confirmation })
}

main()
