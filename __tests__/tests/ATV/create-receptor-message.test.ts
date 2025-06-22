import fs from 'fs'
import { ATV } from '@src/ATV'
import { AceptationStates } from '@src/ATV/core/types'
import { parseElectronicBillXML } from '@src/lib/genXML'
const expectXml = fs.readFileSync('__tests__/stubs/commonExpectedXml.xml', 'utf-8')
const fakePem = fs.readFileSync('__tests__/stubs/dummyKeys/client-identity.p12', 'binary')
const fakePassword = '1234'
describe('Create Receptor Message', () => {
  it('should create document and generate a correct command', async () => {
    const atv = new ATV({}, 'stg')
    const electronillBillRaw = parseElectronicBillXML(expectXml)
    const { command } = await atv.createReceptorMessage({
      aceptationState: AceptationStates.ACCEPTED,
      aceptationDetailMessage: 'Accepted',
      clave: electronillBillRaw.Clave,
      emitterIdentifier: electronillBillRaw.Emisor.Identificacion.Numero,
      emitterIdentifierType: electronillBillRaw.Emisor.Identificacion.Tipo,
      receptorIdentifier: electronillBillRaw.Receptor.Identificacion.Numero,
      receptorIdentifierType: electronillBillRaw.Receptor.Identificacion.Tipo,
      documentIssueDate: new Date(electronillBillRaw.FechaEmision),
      activityCode: electronillBillRaw.CodigoActividadEmisor,
      taxCondition: electronillBillRaw.CondicionVenta,
      totalTaxes: electronillBillRaw.ResumenFactura.TotalImpuesto,
      totalSale: electronillBillRaw.ResumenFactura.TotalVenta,
      branch: '01',
      terminal: '01',
      consecutive: '01',
      token: 'fake-token',
      signatureOptions: {
        buffer: fakePem,
        password: fakePassword
      }
    })
    expect(command.data).toMatchObject({
      clave: '50601042400020692014200100001010000000002100000001',
      fecha: '2024-04-01T00:00:00.000Z',
      emisor: { tipoIdentificacion: electronillBillRaw.Emisor.Identificacion.Tipo, numeroIdentificacion: electronillBillRaw.Emisor.Identificacion.Numero },
      receptor: { tipoIdentificacion: electronillBillRaw.Receptor.Identificacion.Tipo, numeroIdentificacion: electronillBillRaw.Receptor.Identificacion.Numero }
    })
  })
})
