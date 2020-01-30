import { FrontEndRequest, ClaveOpts } from './lib/genJSON/interfaces'
import genClave from './lib/genClave'
import genJSON from './lib/genJSON'
import send from './services/send'

const DEFAULT_VALUES = {
  tipoIdentificacion: '01'
}
interface Person {
  tipoIdentificacion: string;
  numeroIdentificacion: string;
}

interface FinalMessagePerson {
  tipoIdentificacion: string;
  numeroIdentificacion: string;
}

interface FinalMessage {
  clave: string;
  fecha: string;
  emisor: FinalMessagePerson;
  receptor: FinalMessagePerson;
  comprobanteXML: string;
}

function getSender(frontEndRequest: FrontEndRequest): Person {
  const sender = frontEndRequest.Emisor
  return {
    tipoIdentificacion: sender.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion,
    numeroIdentificacion: sender.Identificacion.Numero
  }
}

function getReceiver(frontEndRequest: FrontEndRequest): Person {
  const receiver = frontEndRequest.Receptor
  return {
    tipoIdentificacion: receiver.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion,
    numeroIdentificacion: receiver.Identificacion.Numero
  }
}

function getClave(frontEndRequest: FrontEndRequest): string {
  const sender = getSender(frontEndRequest)
  const claveOptions: ClaveOpts = {
    cedulaEmisor: sender.numeroIdentificacion,
    codigoPais: frontEndRequest.codigoPais,
    codigoSeguridad: frontEndRequest.codigoSeguridad,
    consecutivo: frontEndRequest.consecutivo,
    situacionCE: frontEndRequest.situationEC,
    sucursal: frontEndRequest.sucursal,
    terminal: frontEndRequest.terminal,
    tipoCedula: sender.tipoIdentificacion,
    tipoDocumento: frontEndRequest.tipoDocumento
  }
  return genClave(claveOptions)
}

export default async (token, frontEndRequest: FrontEndRequest, xmlOpt) => {
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

  console.log('final mesagge', finalMesage)
  return send(token, finalMesage).catch((err) => {
    console.log('error', err)
  })
}
