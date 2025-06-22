import fs from 'fs'
import { FEInputExample } from '@test/stubs/createDocument.data'
import { ATV } from '../dist/src'
import { PersonProps } from 'dist/src/ATV/core/Person'
import { AceptationStates } from 'dist/src/ATV/core/types'
import { parseElectronicBillXML } from '@src/lib/genXML'

const IS_STG = process.env.IS_STG
const USERNAME_TEST = process.env.USERNAME_TEST
const PASSWORD_TEST = process.env.PASSWORD_TEST
const XML_TO_CONFIRM = process.env.XML_TO_CONFIRM
console.log('process.env.IS_STG', IS_STG)

const SOURCE_P12_URI = process.env.SOURCE_P12_URI
const SOURCE_P12_PASSPORT = process.env.SOURCE_P12_PASSPORT

if (!SOURCE_P12_PASSPORT || !SOURCE_P12_URI) {
  throw new Error('No environment. For running examples set .env before.')
}

const pem = fs.readFileSync(SOURCE_P12_URI, 'binary')
const receivedDocumentXML = fs.readFileSync(XML_TO_CONFIRM, 'utf-8')

// TODO: dynamic param --identifier 1 args[x]
FEInputExample.consecutiveIdentifier = process.env.TEST_CONSECUTIVE
FEInputExample.emitter.identifier.id = process.env.EMITTER_IDENTIFIER_ID as string
FEInputExample.emitter.identifier.type = process.env.EMITTER_IDENTIFIER_TYPE as PersonProps['identifier']['type']

console.log('requestStub consecutivo', FEInputExample.consecutiveIdentifier)

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
  const electronillBillRaw = parseElectronicBillXML(receivedDocumentXML)
  const { command, extraData } = await atv.createReceptorMessage({
    aceptationState: AceptationStates.ACCEPTED,
    aceptationDetailMessage: 'Accepted',
    clave: electronillBillRaw.Clave,
    emitterIdentifier: electronillBillRaw.Emisor.Identificacion.Numero,
    emitterIdentifierType: electronillBillRaw.Emisor.Identificacion.Tipo,
    receptorIdentifier: electronillBillRaw.Receptor.Identificacion.Numero,
    receptorIdentifierType: electronillBillRaw.Receptor.Identificacion.Tipo,
    documentIssueDate: new Date(electronillBillRaw.FechaEmision),
    activityCode: electronillBillRaw.CodigoActividad,
    taxCondition: electronillBillRaw.CondicionVenta,
    totalTaxes: electronillBillRaw.ResumenFactura.TotalImpuesto,
    totalSale: electronillBillRaw.ResumenFactura.TotalVenta,
    branch: '01',
    terminal: '01',
    consecutive: '01',
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
