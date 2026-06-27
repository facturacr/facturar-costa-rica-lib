import fs from 'fs'
import { FECInputExample } from '@test/stubs/createDocument.data'
import { ATV } from '../dist/src'
import { PersonProps } from 'dist/src/ATV/core/Person'

const getRequiredEnv = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

const USERNAME_TEST = getRequiredEnv('USERNAME_TEST')
const PASSWORD_TEST = getRequiredEnv('PASSWORD_TEST')
const EMITTER_IDENTIFIER_ID = getRequiredEnv('EMITTER_IDENTIFIER_ID')
const EMITTER_IDENTIFIER_TYPE = getRequiredEnv('EMITTER_IDENTIFIER_TYPE') as PersonProps['identifier']['type']

const SOURCE_P12_URI = getRequiredEnv('SOURCE_P12_URI')
const SOURCE_P12_PASSPORT = getRequiredEnv('SOURCE_P12_PASSPORT')

const pem = fs.readFileSync(SOURCE_P12_URI, 'binary')

const paramConsecutive = process.argv[2]
const consecutiveIdentifier = paramConsecutive || process.env.TEST_CONSECUTIVE
console.log('paramConsecutive', paramConsecutive)

// In FacturaElectronicaCompra the non-domiciled supplier is XML Emisor,
// and the local taxpayer/business that signs is XML Receptor.
const receiver = FECInputExample.receiver
if (!receiver) {
  throw new Error('FECInputExample.receiver is required')
}

if (!consecutiveIdentifier) {
  throw new Error('Missing consecutiveIdentifier. Pass it as argument or set TEST_CONSECUTIVE.')
}

FECInputExample.consecutiveIdentifier = consecutiveIdentifier
receiver.identifier.id = EMITTER_IDENTIFIER_ID
receiver.identifier.type = EMITTER_IDENTIFIER_TYPE
FECInputExample.providerId = EMITTER_IDENTIFIER_ID

console.log('requestStub consecutivo', FECInputExample.consecutiveIdentifier)

function getConfimation(atv: ATV, token: string, location: string, ms: number): Promise<Awaited<ReturnType<ATV['sendConfirmation']>>> {
  return new Promise((resolve, reject) => {
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
    document: FECInputExample,
    token: tokenData.accessToken,
    signatureOptions: {
      buffer: pem,
      password: SOURCE_P12_PASSPORT
    }
  })
  console.log({
    clave: command.data.clave,
    emisor: command.data.emisor,
    receptor: command.data.receptor,
    hasImpuestoAsumidoEmisorFabrica: extraData.xml.includes('ImpuestoAsumidoEmisorFabrica')
  })
  const response = await atv.sendDocument(command)
  if (response.errorCause) {
    console.log('error response', response)
    return
  }
  if (!response.location) {
    throw new Error('No confirmation location returned by Hacienda.')
  }
  const confirmationResponse = await getConfimation(atv, tokenData.accessToken, response.location, 3500)
  console.log({ MensajeHacienda: confirmationResponse.confirmation })
}

main()
