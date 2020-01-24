import { FrontEndRequest, ClaveOpts } from './interfaces'
import { SimpleFacturaElectronica } from '../facturaInterfaces'
import genXML from '../genXML'
import genClave from '../genClave'

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

function getClave(frontEndRequest: FrontEndRequest, sender: any): string {
  const claveOptions: ClaveOpts = {
    cedulaEmisor: frontEndRequest.senderID,
    codigoPais: frontEndRequest.countryCode,
    codigoSeguridad: frontEndRequest.securityCode,
    consecutivo: frontEndRequest.consecutive,
    situacionCE: frontEndRequest.situationEC,
    sucursal: frontEndRequest.sale,
    terminal: frontEndRequest.terminal,
    tipoCedula: sender.senderTypeID,
    tipoDocumento: frontEndRequest.typeDocument
  }
  return genClave(claveOptions)
}

function calculateTaxes(billTotal: number, billTaxes: number): number {
  const taxes = typeof billTaxes === 'number' ? billTaxes : DEFAULT_VALUES.taxes
  return (billTotal * taxes) / 100
}

export default (frontEndRequest: FrontEndRequest): any => {
  const sender = findSenderByID()
  const receiver = findReceiverById()
  const taxes = calculateTaxes(frontEndRequest.total, frontEndRequest.tax)
  const key = getClave(frontEndRequest, sender)
  const factura: SimpleFacturaElectronica = {
    Clave: key,
    NombreEmisor: sender.senderName,
    TipoIdentificacionEmisor: sender.senderTypeID,
    NumeroCedulaEmisor: frontEndRequest.senderID,
    NombreReceptor: receiver.receiverName,
    TipoIdentificacionReceptor: receiver.receiverTypeID,
    NumeroCedulaReceptor: frontEndRequest.receiverId,
    Mensaje: DEFAULT_VALUES.message,
    DetalleMensaje: DEFAULT_VALUES.detailsMessage,
    MontoTotalImpuesto: taxes,
    TotalFactura: frontEndRequest.total,
    Signature: {} // .p12 json
  }
  const XML = genXML(factura)
  console.log('XML', XML)
}
