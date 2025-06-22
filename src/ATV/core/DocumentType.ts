export type DocumentNames =
  'FacturaElectronica' |
  'TiqueteElectronico' |
  'FacturaElectronicaExportacion' |
  'NotaCreditoElectronica' |
  'NotaDebitoElectronica' |
  'MensajeReceptor'

const map: {[key: string]: DocumentTypeValues} = {
  FacturaElectronica: 'FE',
  FacturaElectronicaExportacion: 'FE',
  TiqueteElectronico: 'TE',
  NotaCreditoElectronica: 'NC',
  NotaDebitoElectronica: 'NC'
}

export type DocumentTypeValues = 'FE' | 'ND' | 'NC' | 'TE'

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
