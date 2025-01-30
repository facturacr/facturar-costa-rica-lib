import fs from 'fs'
import { ATV } from '@src/ATV'
import 'jest-xml-matcher'
import { createDocumentInputExample } from '@test/stubs/createDocument.data'
const fakePem = fs.readFileSync('__tests__/stubs/dummyKeys/client-identity.p12', 'binary')
const fakePassword = '1234'
const expectXml = fs.readFileSync('__tests__/stubs/commonExpectedXml.xml', 'utf-8')

describe('Create Document (Invoice)', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2024, 3, 1, 0, 0, 0, 0))
  })

  it('should create document and generate a correct command', async () => {
    const atv = new ATV({}, 'stg')
    const createdDoc = await atv.createDocumentCommand({
      document: createDocumentInputExample,
      token: 'fake-token',
      signatureOptions: {
        buffer: fakePem,
        password: fakePassword
      }
    })
    expect(createdDoc.command).toMatchObject({
      url: 'https://api-sandbox.comprobanteselectronicos.go.cr/recepcion/v1/recepcion',
      method: 'post'
    })
    expect(createdDoc.command.data).toMatchObject({
      clave: '50601042400020692014200100001010000000002100000001',
      fecha: '2024-04-01T00:00:00.000Z',
      emisor: { tipoIdentificacion: createDocumentInputExample.emitter.identifier.type, numeroIdentificacion: createDocumentInputExample.emitter.identifier.id },
      receptor: { tipoIdentificacion: createDocumentInputExample.receiver.identifier.type, numeroIdentificacion: createDocumentInputExample.receiver.identifier.id }
    })
    expect(createdDoc.command.data.comprobanteXml).toBeDefined()
    expect(createdDoc.extraData.xml).toBeDefined()
  })

  it('should create document and match to snapshot', async () => {
    const atv = new ATV({}, 'stg')
    // @ts-ignore just for testing
    const createdDoc = await atv.createDocumentCommand({
      document: createDocumentInputExample,
      token: 'fake-token',
      signatureOptions: undefined
    })
    expect(createdDoc.command.data.comprobanteXml).toMatchSnapshot()
  })
  it('should create document and generate a correct xml', async () => {
    const atv = new ATV({}, 'stg')
    // @ts-ignore just for testing
    const createdDoc = await atv.createDocumentCommand({
      document: createDocumentInputExample,
      token: 'fake-token',
      signatureOptions: undefined
    })
    expect(createdDoc.extraData.xml).toEqualXML(expectXml)
  })
})
