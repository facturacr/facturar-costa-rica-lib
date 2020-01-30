import { FrontEndRequest, FinalMessagePerson } from './types/globalInterfaces'
import { getClave } from './lib/genClave/index'
import { xmlToJson } from './lib/genXML/index'
import send from './services/send/index'

const DEFAULT_VALUES = {
  tipoIdentificacion: '01'
}

function getSender(frontEndRequest: FrontEndRequest): FinalMessagePerson {
  const sender = frontEndRequest.Emisor
  return {
    tipoIdentificacion: sender.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion,
    numeroIdentificacion: sender.Identificacion.Numero
  }
}

function getReceiver(frontEndRequest: FrontEndRequest): FinalMessagePerson {
  const receiver = frontEndRequest.Receptor
  return {
    tipoIdentificacion: receiver.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion,
    numeroIdentificacion: receiver.Identificacion.Numero
  }
}

export default async (token, xmlStr): Promise<any> => {
  const date = new Date()
  const fullInvoice = xmlToJson(xmlStr)

  console.log('clave', fullInvoice.Clave)
  const finalMesage = {
    clave: fullInvoice.Clave,
    fecha: date.toISOString(),
    emisor: fullInvoice.Emisor,
    receptor: fullInvoice.Receptor
  }
  //
  // return send(token, finalMesage).catch((err) => {
  //   const response = err.response || {}
  //   const header = response.headers || {}
  //   console.log('x-error-cause', header['x-error-cause'])
  // })
}
