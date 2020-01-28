import { SimpleFacturaElectronica } from '../facturaInterfaces'
import { FrontEndRequest } from './interfaces'
import genXML from '../genXML'

// Default XML Values
const DEFAULT_VALUES = {
  key: 0,
  message: 'Default msj',
  detailsMessage: 'Default details msj',
  taxes: 100
}

// todo: find sender info in db
function findSenderByID(): any {
  return {
    senderName: 'Carlos Blanco',
    senderTypeID: '01'
  }
}

// todo: find receiver info in db
function findReceiverById(): any {
  return {
    receiverName: 'Carlos Rivera',
    receiverTypeID: '01'
  }
}

function calculateTaxes(billTotal: number, billTaxes: number): number {
  const taxes = typeof billTaxes === 'number' ? billTaxes : DEFAULT_VALUES.taxes
  return (billTotal * taxes) / 100
}

export default async (frontEndRequest: FrontEndRequest, clave: string, options: any): Promise<any> => {
  const sender = findSenderByID()
  const receiver = findReceiverById()
  const taxes = calculateTaxes(frontEndRequest.total, frontEndRequest.tax)
  const factura: SimpleFacturaElectronica = {
    Clave: clave,
    NombreEmisor: sender.senderName,
    TipoIdentificacionEmisor: sender.senderTypeID,
    NumeroCedulaEmisor: frontEndRequest.senderID,
    NombreReceptor: receiver.receiverName,
    TipoIdentificacionReceptor: receiver.receiverTypeID,
    NumeroCedulaReceptor: frontEndRequest.receiverId,
    Mensaje: DEFAULT_VALUES.message,
    DetalleMensaje: DEFAULT_VALUES.detailsMessage,
    MontoTotalImpuesto: taxes,
    TotalFactura: frontEndRequest.total
  }
  const XML = await genXML(factura, options)
  return XML
}
