import { DocumentType } from '@src/ATV/core/DocumentType'
import { tipoDocumento } from '@src/data/tipoDocumento'
import { xmlExtructures } from '@src/xmlSchemaHeaderMap'

describe('FacturaElectronicaCompra support', () => {
  it('maps FacturaElectronicaCompra to document type 08', () => {
    const documentType = DocumentType.create('FacturaElectronicaCompra')

    expect(documentType.value).toBe('FEC')
    expect(tipoDocumento[documentType.value].code).toBe('08')
  })

  it('uses the facturaElectronicaCompra namespace', () => {
    expect(xmlExtructures.FacturaElectronicaCompra.xmlns).toContain('/facturaElectronicaCompra')
  })
})
