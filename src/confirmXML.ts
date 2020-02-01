import { MensajeReceptorContenedor } from './types/xml/mensajeReceptor'
import { xmlToJson, genXML } from './lib/genXML/index'
import { send, sendToCustomURL } from './services/send/index'

function getMsjObj(fullInvoice: any): MensajeReceptorContenedor {
  return {
    MensajeReceptor: {
      Clave: fullInvoice.Clave,
      NumeroCedulaEmisor: fullInvoice.Emisor.Identificacion.Numero,
      FechaEmisionDoc: fullInvoice.FechaEmision,
      Mensage: '',
      DetalleMensaje: '',
      MontoTotalImpuesto: fullInvoice.ResumenFactura.TotalImpuesto,
      CodigoActividad: fullInvoice.CodigoActividad,
      NumeroCedulaReceptor: fullInvoice.Receptor.Identificacion.Numero,
      NumeroConsecutivoReceptor: ''
    }
  }
}

export default async (token, xmlStr, pemOpt): Promise<any> => {
  const date = new Date()
  const fullInvoice = xmlToJson(xmlStr)
  const msjObj = getMsjObj(fullInvoice)
  const xmlBase64 = await genXML(msjObj, {
    buffer: pemOpt.buffer,
    password: pemOpt.password,
    base64: true
  })
  const finalMesage = {
    clave: fullInvoice.Clave,
    fecha: date.toISOString(),
    emisor: {
      tipoIdentificacion: '02',
      numeroIdentificacion: '3101123456'
    },
    receptor: {
      tipoIdentificacion: '02',
      numeroIdentificacion: '3101123456'
    },
    consecutivoReceptor: '',
    comprobanteXml: xmlBase64
  }

  const firstResponse = await send(token, finalMesage).catch((err) => {
    const response = err.response || {}
    const header = response.headers || {}
    const data = response.data = {}
    console.log('status', response.status)
    console.log('data', data)
    console.log('x-error-cause', header['x-error-cause'])
  })
  if (firstResponse) {
    const location = firstResponse.headers.location
    console.log('data', location)
    const secondResponse = await sendToCustomURL(token, location).catch((err) => {
      const response = err.response || {}
      const header = response.headers || {}
      const data = response.data = {}
      console.log('status', response.status)
      console.log('data', data)
      console.log('x-error-cause', header['x-error-cause'])
    })
    console.log('secondResponse', secondResponse.data)
  }
}
