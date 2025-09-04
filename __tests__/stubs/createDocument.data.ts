import { DocumentInputWithReceiver } from '@src/ATV/core/CreateDocFactory'
import { CreateDocumentInput } from '@src/index'

const taxStub: CreateDocumentInput['document']['orderLines'][0]['tax'] = {
  code: '01',
  rateCode: '08',
  rate: 13
}

const orderLines: CreateDocumentInput['document']['orderLines'] = [{
  code: '8715600009900',
  quantity: 1,
  measureUnit: 'Sp',
  detail: 'detalle',
  unitaryPrice: 10,
  tax: taxStub
}]

const receiverStub: CreateDocumentInput['document']['emitter'] = {
  fullName: 'EXCLUSIVE COFFEES',
  commercialName: 'EXCLUSIVE COFFEES S.A',
  activityCode: '930903',
  identifier: {
    type: '02',
    id: '3101538252'
  },
  location: {
    province: '2',
    canton: '01',
    district: '08',
    neighborhood: '00006',
    details: '600 metros sur y 400 oeste ofibodegas del oeste'
  },
  phone: {
    countryCode: '506',
    number: '22390301'
  },
  email: 'facturaelectronica@exclusivecoffeecr.com',
  fax: {
    countryCode: '506',
    number: '22390301'
  }
}

const emitterStub: CreateDocumentInput['document']['receiver'] = {
  fullName: 'Tek rocks',
  commercialName: 'Ciencia del sabor',
  activityCode: '930903',
  identifier: {
    type: '01',
    id: '206920142'
  },
  location: {
    province: '2',
    canton: '06',
    district: '04',
    neighborhood: '06',
    details: 'Calle Arrieta'
  },
  email: 'cienciadelsabor@gmail.com',
  fax: {
    countryCode: '506',
    number: '88122479'
  },
  phone: {
    countryCode: '506',
    number: '88122479'
  }
}

export const creditNoteReferenceInfoExample: CreateDocumentInput['document']['referenceInfo'] = {
  docType: '01',
  refNumber: '50627062400310275915700100001010000000004100000001',
  issueDate: new Date(),
  code: '01',
  reason: 'Se anula documento'
}

export const FEInputExample: DocumentInputWithReceiver = {
  consecutiveIdentifier: '2',
  activityCode: '930903',
  providerId: emitterStub.identifier.id,
  documentName: 'FacturaElectronica',
  branch: '1', // '001'
  terminal: '1', // '00001'
  ceSituation: '1',
  countryCode: '506',
  emitter: emitterStub,
  receiver: receiverStub,
  orderLines,
  securityCode: '1', // '00000001'
  paymentMethod: '03',
  conditionSale: '01'
}

export const TEInputExample: CreateDocumentInput['document'] = {
  consecutiveIdentifier: '2',
  activityCode: '4',
  providerId: emitterStub.identifier.id,
  documentName: 'TiqueteElectronico',
  branch: '1', // '001'
  terminal: '1', // '00001'
  ceSituation: '1',
  countryCode: '506',
  emitter: emitterStub,
  orderLines,
  securityCode: '1', // '00000001'
  paymentMethod: '03',
  conditionSale: '01'
}
