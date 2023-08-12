
import axios from 'axios'
import { GetToken } from '../services/getToken/GetToken'
import { GetTokenDto, GetTokenResponse } from '../services/getToken/types'
import { CreateDocumentCommand, CreateDocumentInput } from './useCases/sendDocument/SendDocument'
import { Command, CreateAndSendDocumentResponse } from './useCases/sendDocument/types'
import * as parser from 'fast-xml-parser'
import qs from 'querystring'
import { ConfirmationMessageRaw } from '@src/types/facturaInterfaces'

export type Mode = 'prod' | 'stg' | 'custom';

export type ATVOptions = {
  defaultOverwrites?: {
    tokenServiceUrl: string;
  };
}

export type TokenServiceProps = {
  serviceUrl: string;
  clientId: string;
}

export type SendResponse = {
  status: number;
  location: string;
  errorCause?: string | null;
}

type SendConfirmationInput = {
  url: string;
  headers: {
    Authorization: string;
    'Content-Type': string;
  };
}

type ConfirmationMessage = {
  clave: string;
  message: string;
  details: string;
  emitterFullName: string;
  emitterIdentifierId: string;
  receiverIdentifierId: string;
  taxesTotalAmount: string;
  totalInvoiceAmount: string;
}

export class ATV {
  public readonly options: ATVOptions
  constructor(options?: ATVOptions, public readonly mode: Mode = 'prod') {
    this.options = options
  }

  public getToken(params: GetTokenDto): Promise<GetTokenResponse> {
    const tokenService = new GetToken(this)
    return tokenService.execute(params)
  }

  public createDocumentCommand(input: CreateDocumentInput): Promise<CreateAndSendDocumentResponse> {
    const sendDocument = new CreateDocumentCommand(this)
    return sendDocument.execute(input)
  }

  public async sendDocument(input: Command): Promise<SendResponse> {
    try {
      const response = await axios(input)
      return {
        status: response.status,
        location: response.headers.location,
        errorCause: null
      }
    } catch (error) {
      const response = error.response || {}
      const header = response.headers || {}
      return {
        status: error.response.status || 500,
        errorCause: header['x-error-cause'],
        location: null
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public async sendConfirmation(input: SendConfirmationInput) {
    try {
      const response = await axios(input)
      const xmlResponse = response.data['respuesta-xml']
      if (!xmlResponse) {
        const state = response.data['ind-estado']
        return {
          status: response.status,
          state,
          errorCause: null
        }
      }
      const xmlString = this.decodeBase64(xmlResponse)

      return {
        status: response.status,
        confirmation: this.parseConfirmationMessage(xmlString),
        xml: xmlString,
        errorCause: null
      }
    } catch (error) {
      const response = error.response || {}
      return {
        status: response.status || 500,
        errorCause: response.statusText
      }
    }
  }

  private parseConfirmationMessage(xml: string): ConfirmationMessage {
    const parsedXml: ConfirmationMessageRaw = parser.parse(xml, {
      ignoreAttributes: false,
      tagValueProcessor: a => qs.unescape(a.replace(/(\r\n|\n|\r)/gm, '')),
      ignoreNameSpace: false,
      parseNodeValue: false
    })
    const msj = parsedXml.MensajeHacienda
    return {
      clave: msj.Clave,
      message: msj.Mensaje,
      details: msj.DetalleMensaje,
      emitterFullName: msj.NombreEmisor,
      emitterIdentifierId: msj.NumeroCedulaEmisor,
      receiverIdentifierId: msj.NumeroCedulaReceptor,
      taxesTotalAmount: msj.MontoTotalImpuesto,
      totalInvoiceAmount: msj.TotalFactura
    }
  }

  private decodeBase64(encodedStr: string): string {
    const buff = Buffer.from(encodedStr, 'base64')
    return buff.toString('utf-8')
  }
}
