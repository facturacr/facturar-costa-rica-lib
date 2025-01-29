import { CreateDocumentInput } from "@src/index"

const taxStub: CreateDocumentInput['document']['orderLines'][0]['tax'] = {
  code: '01',
  rateCode: '08',
  rate: 13
}

const orderLines: CreateDocumentInput['document']['orderLines'] = [{
  code: '7113301000000',
  quantity: 1,
  measureUnit: 'Unid',
  detail: 'detalle',
  unitaryPrice: 10,
  tax: taxStub
}]

const receiverStub: CreateDocumentInput['document']['emitter'] = {
  fullName: 'receiver name SRL',
  commercialName: 'receiver name',
  identifier: {
    type: '01',
    id: '206930143'
  },
  location: {
    province: '2',
    canton: '06',
    district: '04',
    neighborhood: '06',
    details: 'details'
  },
  phone: {
    countryCode: '506',
    number: '80808080'
  },
  email: 'test@test.com',
  fax: {
    countryCode: '506',
    number: '80808080'
  }
}

const emitterStub: CreateDocumentInput['document']['receiver'] = {
  fullName: 'Emisor name',
  commercialName: 'emisor comercial name',
  identifier: {
    type: '01',
    id: '206920142'
  },
  location: {
    province: '2',
    canton: '06',
    district: '04',
    neighborhood: '06',
    details: 'details'
  },
  email: 'test@test.com',
  fax: {
    countryCode: '506',
    number: '12341234'
  },
  phone: {
    countryCode: '506',
    number: '12341234'
  }
}

export const creditNoteReferenceInfoExample: CreateDocumentInput['document']['referenceInfo'] = {
  docType: '01',
  refNumber: '50627062400310275915700100001010000000004100000001',
  issueDate: new Date(),
  code: '01',
  reason: 'Se anula documento'
}

export const createDocumentInputExample: CreateDocumentInput['document'] = {
  consecutiveIdentifier: '2',
  activityCode: '4',
  documentName: 'FacturaElectronica',
  branch: '1', // '001'
  terminal: '1', // '00001'
  ceSituation: '1',
  countryCode: '506',
  emitter: emitterStub,
  receiver: receiverStub,
  orderLines,
  securityCode: '1', // '00000001'
  paymentMethod: '03'
}
