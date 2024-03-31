import { DocumentNames } from './documentNames.types'

const map: {[key: string]: DocumentTypeValues} = {
  FacturaElectronica: 'FE',
  FacturaElectronicaExportacion: 'FE',
  NotaCreditoElectronica: 'NC',
  NotaDebitoElectronica: 'NC'
}

type DocumentTypeValues = 'FE' | 'ND' | 'NC' | 'TE'

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
