import { CreateDocumentInput } from '@src/ATV/useCases/sendDocument/types'

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
  fullName: 'SRL',
  commercialName: 'CIENCIA DEL SABOR',
  identifier: {
    type: '02',
    id: '3102759157'
  },
  location: {
    province: '2',
    canton: '06',
    district: '04',
    neighborhood: '06',
    details: '25 norte 500 oeste restaurante El Faro'
  },
  phone: {
    countryCode: '506',
    number: '80808080'
  },
  email: 'cienciadelsabor@gmail.com',
  fax: {
    countryCode: '506',
    number: '80808080'
  }
}

const emitterStub: CreateDocumentInput['document']['receiver'] = {
  fullName: 'Nombre Receptor',
  commercialName: 'xyz',
  identifier: {
    type: '01',
    id: '206920142'
  },
  location: {
    province: '1',
    canton: '1',
    district: '1',
    neighborhood: '1',
    details: 'Señas xyz'
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

export const createDocumentInputStub: CreateDocumentInput['document'] = {
  consecutiveIdentifier: '34',
  activityCode: '4',
  branch: '001',
  terminal: '00001',
  ceSituation: '1',
  countryCode: '506',
  documentType: 'FE',
  emitter: emitterStub,
  receiver: receiverStub,
  orderLines,
  securityCode: '00000001'
}
