export type DocumentNames =
  'FacturaElectronica' |
  'TiqueteElectronico' |
  'FacturaElectronicaCompra' |
  'FacturaElectronicaExportacion' |
  'NotaCreditoElectronica' |
  'NotaDebitoElectronica' |
  'MensajeReceptor'

export type DocumentTypeValues = 'FE' | 'ND' | 'NC' | 'TE' | 'FEC'

const map: {[key: string]: DocumentTypeValues} = {
  FacturaElectronica: 'FE',
  FacturaElectronicaCompra: 'FEC',
  FacturaElectronicaExportacion: 'FE',
  TiqueteElectronico: 'TE',
  NotaCreditoElectronica: 'NC',
  NotaDebitoElectronica: 'NC'
}

export class DocumentType {
  value: DocumentTypeValues

  constructor(value: DocumentTypeValues) {
    this.value = value
  }

  static create(documentName: DocumentNames): DocumentType {
    const value = map[documentName]
    return new DocumentType(value)
  }
}
