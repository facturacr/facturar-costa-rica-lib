import { DocumentInputWithReceiver } from '@src/ATV/core/CreateDocFactory'
import { CreateDocumentInput } from '@src/index'

const taxStub: CreateDocumentInput['document']['orderLines'][0]['tax'] = {
  code: '01',
  rateCode: '08',
  rate: 13
}

const orderLines: CreateDocumentInput['document']['orderLines'] = [{
  code: '9799000000000',
  quantity: 1,
  measureUnit: 'Sp',
  detail: 'detalle',
  unitaryPrice: 10,
  tax: taxStub
}]

const receiverStub: CreateDocumentInput['document']['emitter'] = {
  fullName: 'Roy',
  commercialName: 'Roy Arrieta Soto',
  activityCode: '526005',
  identifier: {
    type: '01',
    id: '204500331'
  },
  location: {
    province: '2',
    canton: '06',
    district: '04',
    neighborhood: '3',
    details: '500 m oeste Súper Don Jorge, casa mano izquierda'
  },
  phone: {
    countryCode: '506',
    number: '87206063'
  },
  email: 'sercoe1@hotmail.com',
  fax: {
    countryCode: '506',
    number: '87206063'
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
