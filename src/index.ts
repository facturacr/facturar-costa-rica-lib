import { FrontEndRequest, FinalMessagePerson } from './types/globalInterfaces'
import { getClave } from './lib/genClave/index'
import genJSON from './lib/genJSON/index'
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

export default async (token, frontEndRequest: FrontEndRequest, xmlOpt): Promise<any> => {
  const clave = getClave(frontEndRequest)
  const date = new Date()
  const XML = await genJSON(frontEndRequest, clave, {
    ...xmlOpt,
    base64: true
  })
  // console.log('frontEndRequest', frontEndRequest)
  const finalMesage = {
    clave: clave,
    fecha: date.toISOString(),
    emisor: getSender(frontEndRequest),
    receptor: getReceiver(frontEndRequest),
    comprobanteXml: XML
  }

  // console.log('final mesagge', finalMesage)
  return send(token, finalMesage).catch((err) => {
    const response = err.response || {}
    const header = response.headers || {}
    console.log('x-error-cause', header['x-error-cause'])
  })
}
