import { MensajeReceptorContenedor } from '@src/types/xml/mensajeReceptor'
import { tipoDocumento } from '@src/data/tipoDocumento'

export function getMsjObj(opts: {
    fullInvoice: any;
    consecutivo: string;
    tipoDocKey: string;
  }): MensajeReceptorContenedor {
  const { fullInvoice, tipoDocKey } = opts
  const emisor = fullInvoice.Emisor
  const receptor = fullInvoice.Receptor
  const msj = tipoDocumento[tipoDocKey].msjReceptorCode
  return {
    MensajeReceptor: {
      Clave: fullInvoice.Clave,
      NumeroCedulaEmisor: emisor.Identificacion.Numero,
      FechaEmisionDoc: fullInvoice.FechaEmision,
      Mensaje: msj,
      DetalleMensaje: '',
      MontoTotalImpuesto: fullInvoice.ResumenFactura.TotalImpuesto,
      CodigoActividad: fullInvoice.CodigoActividad,
      CondicionImpuesto: '04', // TODO investigar casos de uso
      MontoTotalDeGastoAplicable: fullInvoice.ResumenFactura.TotalVenta, // TODO investigar casos de uso
      TotalFactura: fullInvoice.ResumenFactura.TotalVenta,
      NumeroCedulaReceptor: receptor.Identificacion.Numero,
      NumeroConsecutivoReceptor: opts.consecutivo
    }
  }
}

export function getFinalMessage(fullInvoice: any, consecutivoReceptor: string, xmlBase64: any): any {
  const date = new Date()
  return {
    clave: fullInvoice.Clave,
    fecha: date.toISOString(),
    emisor: {
      tipoIdentificacion: fullInvoice.Receptor.Identificacion.Tipo,
      numeroIdentificacion: fullInvoice.Receptor.Identificacion.Numero
    },
    receptor: {
      tipoIdentificacion: fullInvoice.Emisor.Identificacion.Tipo,
      numeroIdentificacion: fullInvoice.Emisor.Identificacion.Numero
    },
    consecutivoReceptor,
    comprobanteXml: xmlBase64
  }
}
