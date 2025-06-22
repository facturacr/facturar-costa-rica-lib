import { Person, PersonProps } from '@src/ATV/core/Person'
import { OrderLine } from '@src/ATV/core/OrderLine'
import { FullConsecutive } from '@src/ATV/core/FullConsecutive'
import { Document } from '@src/ATV/core/Document'
import { Clave } from '@src/ATV/core/Clave'
import { DocumentNames, DocumentType } from '@src/ATV/core/DocumentType'
import { ReferenceInformation, ReferenceInformationProps } from './ReferenceInformation'
import { ReceptorMessageProps } from './types'

type ReferenceInfoInput = ReferenceInformationProps;

type PersonInput = PersonProps;

type TaxInput = {
  code: string;
  rateCode: string;
  rate: number;
  amount?: number;
}

type OrderInput = {
  detail: string;
  unitaryPrice: number;
  lineNumber?: string;
  code?: string;
  quantity?: number;
  measureUnit?: string;
  totalAmount?: number;
  subTotal?: number;
  tax?: TaxInput;
  totalOrderLineAmount?: number;
}

type DocumentInputBase = {
  emitter: PersonInput;
  branch: string;
  terminal: string;
  documentName: DocumentNames;
  providerId: string;
  countryCode: string;
  securityCode: string;
  activityCode: string;
  consecutiveIdentifier: string;
  ceSituation: string;
  orderLines: OrderInput[];
  referenceInfo?: ReferenceInfoInput;
  conditionSale: string;
  paymentMethod: string;
};

type DocumentInputTiquete = DocumentInputBase & {
  documentName: 'TiqueteElectronico';
  receiver?: PersonInput; // optional
};

export type DocumentInputWithReceiver = DocumentInputBase & {
  documentName: Exclude<DocumentNames, 'TiqueteElectronico'>;
  receiver: PersonInput; // required
};

type DocumentInput = DocumentInputTiquete | DocumentInputWithReceiver;

export type CreateDocumentInput = {
  document: DocumentInput;
  token: string;
  receptorMessageProps?: ReceptorMessageProps;
  signatureOptions: {
    buffer: string;
    password: string;
  };
}

export class CreateDocFactory {
  public createDocument(document: CreateDocumentInput['document']): Document {
    const documentType = DocumentType.create(document.documentName)
    const clave = this.createClave(document, documentType)
    const fullConsective = this.createFullConsecutive(document, documentType)
    const orderLines = this.createOrderLines(document)
    return Document.create({
      clave,
      fullConsecutive: fullConsective,
      orderLines,
      providerId: document.providerId,
      issueDate: new Date(),
      emitter: Person.create(document.emitter),
      receiver: document.receiver ? Person.create(document.receiver) : undefined,
      conditionSale: document.conditionSale,
      paymentMethod: document.paymentMethod,
      referenceInformation: document.referenceInfo ? ReferenceInformation.create(document.referenceInfo) : undefined
    })
  }

  private createOrderLines(dto: CreateDocumentInput['document']): OrderLine[] {
    return dto.orderLines.map((orderLine, index) => {
      return OrderLine.create({
        detail: orderLine.detail,
        unitaryPrice: orderLine.unitaryPrice,
        lineNumber: orderLine.lineNumber || (index + 1).toString(),
        code: orderLine.code,
        quantity: orderLine.quantity,
        measureUnit: orderLine.measureUnit,
        totalAmount: orderLine.totalAmount,
        tax: orderLine.tax
      })
    })
  }

  private createFullConsecutive(dto: CreateDocumentInput['document'], docType: DocumentType): FullConsecutive {
    return FullConsecutive.create({
      consecutiveIdentifier: dto.consecutiveIdentifier,
      branch: dto.branch.padStart(3, '0'),
      terminal: dto.terminal.padStart(5, '0'),
      documentType: docType.value
    })
  }

  private createClave(dto: CreateDocumentInput['document'], docType: DocumentType): Clave {
    return Clave.create({
      branch: dto.branch,
      ceSituation: dto.ceSituation,
      consecutiveIdentifier: dto.consecutiveIdentifier,
      countryCode: dto.countryCode,
      docKeyType: docType.value,
      emitterIdentifier: dto.emitter.identifier.id,
      identifierType: dto.emitter.identifier.type || '01',
      securityCode: dto.securityCode,
      terminal: dto.terminal
    })
  }
}
