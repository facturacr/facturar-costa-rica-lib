import { Document } from '@src/ATV/core/Document'

import { mapDocumentToAtvFormat as mapBillToAtvFormat } from '@src/ATV/mappers/billDocToAtv'
import { genXML } from '@src/lib/genXML'
import { CreateAndSendDocumentResponse, Command } from './types'
import { ATV } from '@src/ATV'
import { CreateDocFactory, CreateDocumentInput } from '@src/ATV/core/CreateDocFactory'

const options: { [key: string]: { serviceUrl: string}} = {
  prod: {
    serviceUrl: 'https://api.comprobanteselectronicos.go.cr/recepcion/v1/recepcion'
  },
  stg: {
    serviceUrl: 'https://api-sandbox.comprobanteselectronicos.go.cr/recepcion/v1/recepcion'
  }
}

export class CreateDocumentCommand {
  private readonly serviceUrl: string

  private readonly createDoc: CreateDocFactory

  constructor(scope: ATV) {
    this.serviceUrl = options[scope.mode].serviceUrl
    this.createDoc = new CreateDocFactory()
  }

  public async execute(dto: CreateDocumentInput): Promise<CreateAndSendDocumentResponse> {
    const documentName = dto.document.documentName || 'FacturaElectronica' // TODO NotaDebitoElectronica
    const document = this.createDoc.createDocument(dto.document)
    const atvDocument = mapBillToAtvFormat(documentName, document)
    const xml = await genXML(documentName, atvDocument, dto.signatureOptions)
    const command = await this.createDocumentCommand(document, xml, dto.token)
    return {
      command,
      extraData: {
        xml,
        document: atvDocument
      }
    }
  }

  private async createDocumentCommand(document: Document, xml: string, token: string): Promise<Command> {
    return {
      url: this.serviceUrl,
      method: 'post',
      data: {
        clave: document.clave,
        fecha: document.issueDate.toISOString(),
        emisor: {
          // @ts-expect-error pending-to-fix
          tipoIdentificacion: document.emitter.identifierType,
          numeroIdentificacion: document.emitter.identifierId
        },
        receptor: {
          // @ts-expect-error pending-to-fix
          tipoIdentificacion: document.receiver.identifierType,
          // @ts-expect-error pending-to-fix
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

  private encodeXML(xmlStr: string): string {
    const buffer = Buffer.from(xmlStr)
    return buffer.toString('base64')
  }
}
