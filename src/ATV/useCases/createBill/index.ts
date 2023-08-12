import { Person } from '@src/ATV/core/Person'
import { OrderLine } from '@src/ATV/core/OrderLine'
import { FullConsecutive } from '@src/ATV/core/FullConsecutive'
import { Bill } from '@src/ATV/core/Bill'
import { Clave } from '@src/ATV/core/Clave'
import { mapDocumentToAtvFormat as mapBillToAtvFormat } from '@src/ATV/mappers/billDocToAtv'
import { genXML } from '@src/lib/genXML'
import { CreateAndSendDocumentResponse, CreateBillInput, Command } from './types'
import { ATV } from '@src/ATV'
export type { CreateBillInput } from './types'

const options: { [key: string]: { serviceUrl: string}} = {
  prod: {
    serviceUrl: 'https://api.comprobanteselectronicos.go.cr/v1/recepcion'
  },
  stg: {
    serviceUrl: 'https://api-sandbox.comprobanteselectronicos.go.cr/recepcion/v1/recepcion'
  }
}

export class CreateBillCommand {
  private readonly serviceUrl: string;

  constructor(scope: ATV) {
    this.serviceUrl = options[scope.mode].serviceUrl
  }

  public async execute(dto: CreateBillInput): Promise<CreateAndSendDocumentResponse> {
    const documentName = dto.document.documentName || 'FacturaElectronica'
    const document = this.createBill(dto.document)
    const atvDocument = mapBillToAtvFormat(documentName, document)
    const xml = await genXML(documentName, atvDocument, dto.signatureOptions)
    const command = await this.createBillCommand(document, xml, dto.token)
    return {
      command,
      extraData: {
        xml
      }
    }
  }

  private async createBillCommand(document: Bill, xml: string, token: string): Promise<Command> {
    return {
      url: this.serviceUrl,
      method: 'post',
      data: {
        clave: document.clave,
        fecha: document.issueDate.toISOString(),
        emisor: {
          tipoIdentificacion: document.emitter.identifierType,
          numeroIdentificacion: document.emitter.identifierId
        },
        receptor: {
          tipoIdentificacion: document.receiver.identifierType,
          numeroIdentificacion: document.receiver.identifierId
        },
        comprobanteXml: this.encodeXML(xml)
      },
      headers: {
        Authorization: 'bearer ' + token,
        'Content-Type': 'application/json'
      }
    }
  }

  private createBill(document: CreateBillInput['document']): Bill {
    const emitter = this.createEmitter(document.emitter)
    const receiver = this.createReceiver(document.receiver)
    const clave = this.createClave(document)
    const fullConsective = this.createFullConsecutive(document)
    const orderLines = this.createOrderLines(document)
    return Bill.create({
      clave: clave,
      fullConsecutive: fullConsective,
      orderLines: orderLines,
      activityCode: document.activityCode,
      issueDate: new Date(),
      emitter: emitter,
      receiver: receiver,
      conditionSale: '01',
      paymentMethod: '01'
    })
  }

  private createEmitter(emitterInput: CreateBillInput['document']['emitter']): Person {
    return Person.create(emitterInput)
  }

  private createReceiver(receiverInput: CreateBillInput['document']['receiver']): Person {
    return Person.create(receiverInput)
  }

  private createOrderLines(dto: CreateBillInput['document']): OrderLine[] {
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

  private createFullConsecutive(dto: CreateBillInput['document']): FullConsecutive {
    return FullConsecutive.create({
      consecutiveIdentifier: dto.consecutiveIdentifier,
      branch: dto.branch,
      terminal: dto.terminal,
      documentType: dto.documentType
    })
  }

  private createClave(dto: CreateBillInput['document']): Clave {
    return Clave.create({
      branch: dto.branch,
      ceSituation: dto.ceSituation,
      consecutiveIdentifier: dto.consecutiveIdentifier,
      countryCode: dto.countryCode,
      docKeyType: dto.documentType,
      emitterIdentifier: dto.emitter.identifier.id,
      identifierType: dto.emitter.identifier.type, // TODO add default
      securityCode: dto.securityCode,
      terminal: dto.terminal
    })
  }

  private encodeXML(xmlStr: string): string {
    const buffer = Buffer.from(xmlStr)
    return buffer.toString('base64')
  }
}
