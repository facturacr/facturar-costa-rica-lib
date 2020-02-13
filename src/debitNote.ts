import { FrontEndRequest, XmlOpt } from './types/globalInterfaces'
import { NotaDebitoContenedor } from './types/xml/notaDeDebito'
import { genXML } from './lib/genXML/index'
import { send } from './services/send/index'
import { genClaveObj, genString, parseOptions } from './lib/genClave/index'
import {
  getBillResum,
  getReceiver,
  getSender,
  getSimpleReceiver,
  getSimpleSender
} from './helpers/comprobantes'

const VOUCHER_TYPE = 'ND'

export function parseCreditNote(options: {
  frontEndRequest: FrontEndRequest;
  consecutivo: string;
  clave: string;
  date: Date;
}): NotaDebitoContenedor {
  const resum = getBillResum(options.frontEndRequest)
  const receiver = getReceiver(options.frontEndRequest)
  const sender = getSender(options.frontEndRequest)
  return {
    NotaDebitoElectronica: {
      Clave: options.clave,
      CodigoActividad: options.frontEndRequest.actividad.padStart(6, '0'),
      NumeroConsecutivo: options.consecutivo,
      FechaEmision: options.date.toISOString(),
      Emisor: sender,
      Receptor: receiver,
      CondicionVenta: '01',
      MedioPago: '01',
      DetalleServicio: {
        LineaDetalle: options.frontEndRequest.LineasDetalle
      },
      ResumenFactura: resum
    }
  }
}

function sendMessage(options: {
  frontEndRequest: FrontEndRequest;
  token: string;
  clave: string;
  date: Date;
  xml: string;
}): Promise<any> {
  const emisor = getSimpleSender(options.frontEndRequest)
  const receptor = getSimpleReceiver(options.frontEndRequest)
  const finalMesage = {
    clave: options.clave,
    fecha: options.date.toISOString(),
    emisor,
    receptor,
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
  const clave = genString(claveObj)
  const consecutivo = Object.values(claveObj.consecutivo).join('')
  const vaucher = parseCreditNote({
    frontEndRequest: options.frontEndRequest,
    consecutivo,
    clave,
    date
  })
  const xml = await genXML(VOUCHER_TYPE, vaucher, {
    ...options.xmlOpt,
    base64: true
  })
  return sendMessage({
    frontEndRequest: options.frontEndRequest,
    token: options.token,
    clave,
    date,
    xml
  })
}
