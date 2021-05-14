import { ClientPayload, FinalMessagePerson } from './types/globalInterfaces'
import { genClaveObj, genString, parseOptions } from './lib/genClave/index'
import genJSON from './lib/genJSON/index'
import { send } from './services/send/index'

const DEFAULT_VALUES = {
  tipoIdentificacion: '01'
}

function getSender(frontEndRequest: ClientPayload): FinalMessagePerson {
  const sender = frontEndRequest.Emisor
  return {
    tipoIdentificacion: sender.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion,
    numeroIdentificacion: sender.Identificacion.Numero
  }
}

function getReceiver(frontEndRequest: ClientPayload): FinalMessagePerson {
  const receiver = frontEndRequest.Receptor
  return {
    tipoIdentificacion: receiver.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion,
    numeroIdentificacion: receiver.Identificacion.Numero
  }
}

export default async (token, frontEndRequest: ClientPayload, xmlOpt): Promise<any> => {
  const parsedOpts = parseOptions(frontEndRequest)
  const claveObj = genClaveObj(parsedOpts)
  const claveStr = genString(claveObj)
  const date = new Date()
  const consecutivo = Object.values(claveObj.consecutivo).join('')
  const XML = await genJSON(frontEndRequest, date.toISOString(), claveStr, consecutivo, {
    ...xmlOpt,
    base64: true
  })
  const finalMesage = {
    clave: claveStr,
    fecha: date.toISOString(),
    emisor: getSender(frontEndRequest),
    receptor: getReceiver(frontEndRequest),
    comprobanteXml: XML
  }
  return send(token, finalMesage).catch((err) => {
    const response = err.response || {}
    const header = response.headers || {}
    console.log('x-error-cause', header['x-error-cause'])
  })
}
