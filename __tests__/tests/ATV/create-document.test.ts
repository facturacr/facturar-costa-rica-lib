import fs from 'fs'
import { ATV } from '@src/ATV'
import 'jest-xml-matcher'
import { FECInputExample, FEInputExample } from '@test/stubs/createDocument.data'
import { Clave } from '@src/ATV/core/Clave'
import { Document as DomainDocument } from '@src/ATV/core/Document'
import { FullConsecutive } from '@src/ATV/core/FullConsecutive'
import { OrderLine } from '@src/ATV/core/OrderLine'
import { Person } from '@src/ATV/core/Person'
import { ReferenceInformation } from '@src/ATV/core/ReferenceInformation'
import { mapDocumentToAtvFormat } from '@src/ATV/mappers/billDocToAtv'
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

  it('should place purchase invoice reference information before other text', async () => {
    const receiver = FECInputExample.receiver
    const referenceInfo = FECInputExample.referenceInfo
    if (!receiver || !referenceInfo) throw new Error('FECInputExample receiver and referenceInfo are required')

    const document = DomainDocument.create({
      clave: Clave.create({
        branch: FECInputExample.branch,
        ceSituation: FECInputExample.ceSituation,
        consecutiveIdentifier: FECInputExample.consecutiveIdentifier,
        countryCode: FECInputExample.countryCode,
        docKeyType: 'FEC',
        emitterIdentifier: receiver.identifier.id,
        identifierType: receiver.identifier.type || '01',
        securityCode: FECInputExample.securityCode,
        terminal: FECInputExample.terminal
      }),
      fullConsecutive: FullConsecutive.create({
        consecutiveIdentifier: FECInputExample.consecutiveIdentifier,
        branch: FECInputExample.branch,
        terminal: FECInputExample.terminal,
        documentType: 'FEC'
      }),
      orderLines: FECInputExample.orderLines.map((orderLine, index) => OrderLine.create({
        detail: orderLine.detail,
        unitaryPrice: orderLine.unitaryPrice,
        lineNumber: orderLine.lineNumber || (index + 1).toString(),
        code: orderLine.code,
        quantity: orderLine.quantity,
        measureUnit: orderLine.measureUnit,
        totalAmount: orderLine.totalAmount,
        tax: orderLine.tax
      })),
      providerId: FECInputExample.providerId,
      issueDate: new Date(),
      emitter: Person.create(FECInputExample.emitter),
      receiver: Person.create(receiver),
      conditionSale: FECInputExample.conditionSale,
      paymentMethod: FECInputExample.paymentMethod,
      referenceInformation: ReferenceInformation.create(referenceInfo),
      others: {
        OtroTexto: 'Factura Electronica de Compra generada automaticamente.'
      }
    })
    const createdDoc = mapDocumentToAtvFormat('FacturaElectronicaCompra', document)
    const keys = Object.keys(createdDoc.FacturaElectronicaCompra)

    expect(keys.indexOf('InformacionReferencia')).toBeGreaterThan(-1)
    expect(keys.indexOf('Otros')).toBeGreaterThan(-1)
    expect(keys.indexOf('InformacionReferencia')).toBeLessThan(keys.indexOf('Otros'))
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
