import { FrontEndRequest, ClaveOpts } from './lib/genJSON/interfaces'
import genClave from './lib/genClave'
import genJSON from './lib/genJSON'
import send from './services/send'

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

function getClave(frontEndRequest: FrontEndRequest): string {
  const claveOptions: ClaveOpts = {
    cedulaEmisor: frontEndRequest.senderID,
    codigoPais: frontEndRequest.countryCode,
    codigoSeguridad: frontEndRequest.securityCode,
    consecutivo: frontEndRequest.consecutive,
    situacionCE: frontEndRequest.situationEC,
    sucursal: frontEndRequest.sale,
    terminal: frontEndRequest.terminal,
    tipoCedula: '01',
    tipoDocumento: frontEndRequest.typeDocument
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
    emisor: {
      tipoIdentificacion: '01',
      numeroIdentificacion: frontEndRequest.senderID
    },
    receptor: {
      tipoIdentificacion: '01',
      numeroIdentificacion: frontEndRequest.receiverId
    },
    comprobanteXml: XML
  }
  await send(token, finalMesage).catch((err) => {
    console.log('error', err)
  })
}
