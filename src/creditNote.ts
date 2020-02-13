import { FrontEndRequest, XmlOpt } from './types/globalInterfaces'
import { NotaCreditoContenedor } from './types/xml/notaDeCredito'
import { Persona } from './types/facturaInterfaces'
import { genXML } from './lib/genXML/index'
import { send } from './services/send/index'
import { genClaveObj, genString, parseOptions } from './lib/genClave/index'
import { getBillResum, getReceiver, getSender } from './helpers/comprobantes'

const VOUCHER_TYPE = 'NC'

type Voucher = {
  creditNote: NotaCreditoContenedor;
  sender: Persona;
  receiver: Persona;
}

export function parseVoucherData(frontEndRequest: FrontEndRequest, consecutivo: string, clave: string, date: Date): Voucher {
  const resum = getBillResum(frontEndRequest)
  const receiver = getReceiver(frontEndRequest)
  const sender = getSender(frontEndRequest)
  return {
    sender,
    receiver,
    creditNote: {
      NotaCreditoElectronica: {
        Clave: clave,
        CodigoActividad: frontEndRequest.actividad.padStart(6, '0'),
        NumeroConsecutivo: consecutivo,
        FechaEmision: date.toISOString(),
        Emisor: sender,
        Receptor: receiver,
        CondicionVenta: '01',
        MedioPago: '01',
        DetalleServicio: {
          LineaDetalle: frontEndRequest.LineasDetalle
        },
        ResumenFactura: resum
      }
    }
  }
}

function sendMessage(options: {
  token: string;
  clave: string;
  sender: Persona;
  receiver: Persona;
  date: Date;
  xml: string;
}): Promise<any> {
  const finalMesage = {
    clave: options.clave,
    fecha: options.date.toISOString(),
    emisor: {
      tipoIdentificacion: options.sender.Identificacion.Tipo,
      numeroIdentificacion: options.sender.Identificacion.Numero
    },
    receptor: {
      tipoIdentificacion: options.receiver.Identificacion.Tipo,
      numeroIdentificacion: options.receiver.Identificacion.Numero
    },
    comprobanteXml: options.xml
  }
  return send(options.token, finalMesage).catch((err) => {
    const response = err.response || {}
    const header = response.headers || {}
    console.log('x-error-cause', header['x-error-cause'])
  })
}

export default async (options: {
  token: string;
  frontEndRequest: FrontEndRequest;
  xmlOpt: XmlOpt;
}): Promise<any> => {
  const date = new Date()
  const parsedOpts = parseOptions(options.frontEndRequest)
  const claveObj = genClaveObj(parsedOpts)
  const claveStr = genString(claveObj)
  const consecutivo = Object.values(claveObj.consecutivo).join('')
  const vaucher = parseVoucherData(options.frontEndRequest, consecutivo, claveStr, date)
  const xml = await genXML(VOUCHER_TYPE, vaucher.creditNote, {
    ...options.xmlOpt,
    base64: true
  })
  return sendMessage({
    token: options.token,
    clave: claveStr,
    sender: vaucher.sender,
    receiver: vaucher.receiver,
    date,
    xml
  })
}
