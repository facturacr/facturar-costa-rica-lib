import { FrontEndRequest } from './types/globalInterfaces'
import { Message, Resumen, Persona } from './types/facturaInterfaces'
import { NotaCreditoContenedor } from './types/xml/notaDeCredito'
import { getClave } from './lib/genClave/index'
import { genXML } from './lib/genXML/index'
import { send } from './services/send/index'

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
      Numero: sender.Identificacion.Numero,
      Tipo: sender.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion
    }
  }
}

function getReceiver(frontEndRequest: FrontEndRequest): Persona {
  const receiver = frontEndRequest.Receptor
  return {
    Nombre: receiver.Nombre,
    Identificacion: {
      Numero: receiver.Identificacion.Numero,
      Tipo: receiver.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion
    }
  }
}

function parseClientData(frontEndRequest: FrontEndRequest): NotaCreditoContenedor {
  const clave = getClave(frontEndRequest)
  const resum = getBillResum(frontEndRequest)
  const receiver = getReceiver(frontEndRequest)
  const sender = getSender(frontEndRequest)
  return {
    NotaCreditoElectronica: {
      Clave: clave,
      Emisor: receiver,
      Receptor: sender,
      CodigoActividad: frontEndRequest.actividad,
      NumeroConsecutivo: frontEndRequest.consecutivo
    }
  }
}

export default async (token, frontEndRequest: FrontEndRequest, xmlOpt): Promise<any> => {
  const creditNote = parseClientData(frontEndRequest)
  const date = new Date()
  const XML = await genXML(creditNote, {
    ...xmlOpt,
    base64: true
  })
  const finalMesage = {
    clave: creditNote.NotaCreditoElectronica.Clave,
    fecha: date.toISOString(),
    emisor: getSender(frontEndRequest),
    receptor: getReceiver(frontEndRequest),
    comprobanteXml: XML
  }

  const firstResponse = await send(token, finalMesage).catch((err) => {
    const response = err.response || {}
    const header = response.headers || {}
    console.log('x-error-cause', header['x-error-cause'])
  })
  console.log('response', firstResponse)
}
