import fs from 'fs'
import { ATV } from '@src/ATV'
import 'jest-xml-matcher'
import { FECInputExample, FEInputExample } from '@test/stubs/createDocument.data'
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
      document: FEInputExample,
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
      emisor: { tipoIdentificacion: FEInputExample.emitter.identifier.type, numeroIdentificacion: FEInputExample.emitter.identifier.id },
      receptor: { tipoIdentificacion: FEInputExample.receiver.identifier.type, numeroIdentificacion: FEInputExample.receiver.identifier.id }
    })
    expect(createdDoc.command.data.comprobanteXml).toBeDefined()
    expect(createdDoc.extraData.xml).toBeDefined()
  })

  it('should create document and match to snapshot', async () => {
    const atv = new ATV({}, 'stg')
    const createdDoc = await atv.createDocumentCommand({
      document: FEInputExample,
      token: 'fake-token',
      // @ts-expect-error only for testing
      signatureOptions: undefined
    })
    expect(createdDoc.command.data.comprobanteXml).toMatchSnapshot()
  })
  it('should create document and generate a correct xml', async () => {
    const atv = new ATV({}, 'stg')
    const createdDoc = await atv.createDocumentCommand({
      document: FEInputExample,
      token: 'fake-token',
      // @ts-expect-error only for testing
      signatureOptions: undefined
    })
    expect(createdDoc.extraData.xml).toEqualXML(expectXml)
  })

  it('should create a purchase invoice without factory-assumed tax fields', async () => {
    const atv = new ATV({}, 'stg')
    const createdDoc = await atv.createDocumentCommand({
      document: FECInputExample,
      token: 'fake-token',
      // @ts-expect-error only for testing
      signatureOptions: undefined
    })

    expect(createdDoc.extraData.xml).toContain('<FacturaElectronicaCompra')
    expect(createdDoc.extraData.xml).toContain('<ImpuestoNeto>')
    expect(createdDoc.extraData.xml).not.toContain('<ImpuestoAsumidoEmisorFabrica>')
    expect(createdDoc.extraData.xml).not.toContain('<TotalImpAsumEmisorFabrica>')
  })

  it('should create a purchase invoice key and activity from the signing receiver', async () => {
    const receiver = FECInputExample.receiver
    if (!receiver) throw new Error('FECInputExample.receiver is required')

    const atv = new ATV({}, 'stg')
    const createdDoc = await atv.createDocumentCommand({
      document: FECInputExample,
      token: 'fake-token',
      // @ts-expect-error only for testing
      signatureOptions: undefined
    })

    expect(createdDoc.command.data.clave).toContain(receiver.identifier.id.padStart(12, '0'))
    expect(createdDoc.extraData.xml).toContain(`<CodigoActividadEmisor>${receiver.activityCode.padStart(6, '0')}</CodigoActividadEmisor>`)
    expect(createdDoc.extraData.xml).toContain(`<Numero>${FECInputExample.emitter.identifier.id}</Numero>`)
    expect(createdDoc.extraData.xml).toContain(`<Numero>${receiver.identifier.id}</Numero>`)
  })
})
