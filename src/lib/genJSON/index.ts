import { FacturaElectronicaContenedor, Message, Resumen, Persona } from '../../types/facturaInterfaces'
import { FrontEndRequest } from '../../types/globalInterfaces'
import { genXML } from '../genXML'

// Default XML Values
const DEFAULT_VALUES = {
  key: 0,
  message: 'Default msj',
  detailsMessage: 'Default details msj',
  taxes: 100,
  tipoIdentificacion: '01'
}

function getDefaultMessage(): Message {
  return {
    Mensaje: DEFAULT_VALUES.message,
    DetalleMensaje: DEFAULT_VALUES.detailsMessage
  }
}

function calculateTaxes(billTotal: number, billTaxes: number): number {
  const taxes = typeof billTaxes === 'number' ? billTaxes : DEFAULT_VALUES.taxes
  return (billTotal * taxes) / 100
}

function getBillResum(frontEndRequest: FrontEndRequest): Resumen {
  const taxes = calculateTaxes(frontEndRequest.total, frontEndRequest.impuesto)
  return {
    TotalImpuesto: taxes,
    TotalVenta: frontEndRequest.total
  }
}

function getSender(frontEndRequest: FrontEndRequest): Persona {
  const sender = frontEndRequest.Emisor
  return {
    Nombre: sender.Nombre,
    Identificacion: {
      Tipo: sender.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion,
      Numero: sender.Identificacion.Numero
    }
  }
}

function getReceiver(frontEndRequest: FrontEndRequest): Persona {
  const receiver = frontEndRequest.Receptor
  return {
    Nombre: receiver.Nombre,
    Identificacion: {
      Tipo: receiver.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion,
      Numero: receiver.Identificacion.Numero
    }
  }
}

export default async (frontEndRequest: FrontEndRequest, date: any, clave: string, options: any): Promise<any> => {
  const resum = getBillResum(frontEndRequest)
  const receiver = getReceiver(frontEndRequest)
  const sender = getSender(frontEndRequest)
  const message = getDefaultMessage()
  const factura: FacturaElectronicaContenedor = {
    FacturaElectronica: {
      Clave: clave,
      CodigoActividad: frontEndRequest.actividad.padStart(6, '0'),
      NumeroConsecutivo: frontEndRequest.consecutivo.padStart(20, '0'),
      FechaEmision: date,
      Emisor: sender,
      Receptor: receiver,
      Mensaje: message,
      ResumenFactura: resum
    }
  }
  const XML = await genXML(factura, options)
  return XML
}
