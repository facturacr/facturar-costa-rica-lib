import { AceptationStates, ReceptorMessageProps } from "@src/ATV/core/types";
import { mapReceptorMessageToAtvFormat } from "@src/ATV/mappers/billDocToAtv";
import { genXML, parseElectronicBillXML } from "@src/lib/genXML";
import { Command } from "../createDocument/types";
import { ATV } from "@src/ATV";
import { ReceptorConsecutive } from "@src/ATV/core/ReceptorConsecutive";

export type CreateReceptorMessageCommandInput = {
    receivedDocument: string;
    aceptationState: AceptationStates;
    aceptationDetailMessage: string;
    branch: string;
    terminal: string;
    token: string;
    consecutive: string;
    signatureOptions: {
        buffer: string;
        password: string;
    };
}

const options: { [key: string]: { serviceUrl: string}} = {
    prod: {
      serviceUrl: 'https://api.comprobanteselectronicos.go.cr/v1/recepcion'
    },
    stg: {
      serviceUrl: 'https://api-sandbox.comprobanteselectronicos.go.cr/recepcion/v1/recepcion'
    }
  }

export class CreateReceptorMessageCommand {
    private readonly serviceUrl: string

    constructor(scope: ATV) {
        this.serviceUrl = options[scope.mode].serviceUrl
    }

    public async execute(input: CreateReceptorMessageCommandInput) {
        const receptorMessageProps = this.processDocument(input)
        const atvDocument = mapReceptorMessageToAtvFormat(receptorMessageProps)
        const xml = await genXML('MensajeReceptor', atvDocument, input.signatureOptions)
        const command = await this.createDocumentCommand(receptorMessageProps, xml, input.token)
        return {
            command,
            extraData: {
              xml,
              document: atvDocument
            }
        }
    }

    private async createDocumentCommand(receptorMessageProps: ReceptorMessageProps, xml: string, token: string): Promise<Command> {
        return {
          url: this.serviceUrl,
          method: 'post',
          data: {
            clave: receptorMessageProps.clave,
            fecha: receptorMessageProps.documentIssueDate.toISOString(),
            emisor: {
              tipoIdentificacion: receptorMessageProps.emitterIdentifierType,
              numeroIdentificacion: receptorMessageProps.emitterIdentifier,
            },
            receptor: {
              tipoIdentificacion: receptorMessageProps.receptorIdentifierType,
              numeroIdentificacion: receptorMessageProps.receptorIdentifier,
            },
            comprobanteXml: this.encodeXML(xml),
            consecutivoReceptor: receptorMessageProps.receptorConcecutive
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

    private acceptationStateToDocumentType(aceptationState: AceptationStates) {
      switch (aceptationState) {
        case AceptationStates.ACCEPTED:
          return '05'
        case AceptationStates.PARTIALLY_ACCEPTED:
          return '06'
        default:
          return '07'
      }
    }

    private processDocument(input: CreateReceptorMessageCommandInput): ReceptorMessageProps {
        try {
            const electronillBillRaw = parseElectronicBillXML(input.receivedDocument)
            const receptorConsecutive = ReceptorConsecutive.create({
              branch: input.branch,
              terminal: input.terminal,
              documentType: this.acceptationStateToDocumentType(input.aceptationState),
              consecutive: input.consecutive,
            })
            return {
                clave: electronillBillRaw.Clave,
                emitterIdentifier: electronillBillRaw.Emisor.Identificacion.Numero,
                emitterIdentifierType: electronillBillRaw.Emisor.Identificacion.Tipo,
                receptorIdentifier: electronillBillRaw.Receptor.Identificacion.Numero,
                receptorIdentifierType: electronillBillRaw.Receptor.Identificacion.Tipo,
                documentIssueDate: new Date(electronillBillRaw.FechaEmision),
                activityCode: electronillBillRaw.CodigoActividad,
                taxCondition: electronillBillRaw.CondicionVenta,
                totalTaxes: electronillBillRaw.ResumenFactura.TotalImpuesto,
                totalSale:  electronillBillRaw.ResumenFactura.TotalVenta,
                aceptationState: input.aceptationState,
                aceptationDetailMessage: input.aceptationDetailMessage,
                receptorConcecutive: receptorConsecutive.value
            }
        } catch (err) {
            throw new Error('Error parsing the document')
        }
    }
}