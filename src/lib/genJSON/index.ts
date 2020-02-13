import { FacturaElectronicaContenedor, Message, Resumen, Persona } from '../../types/facturaInterfaces'
import { FrontEndRequest } from '../../types/globalInterfaces'
import { genXML } from '../genXML'

// Default XML Values
const DEFAULT_VALUES = {
  key: 0,
  message: 'Default msj',
  detailsMessage: 'Default details msj',
  taxes: 0.13,
  tipoIdentificacion: '01'
}

function getDefaultMessage(): Message {
  return {
    Mensaje: DEFAULT_VALUES.message,
    DetalleMensaje: DEFAULT_VALUES.detailsMessage
  }
}

function sumLines(opts: FrontEndRequest): any {
  return opts.LineasDetalle.reduce((accumulator: any, currentValue: any) => {
    const prevTotal = accumulator.MontoTotal || 0
    const prevTax = accumulator.Impuesto || { Impuesto: { Monto: 0 } }
    return {
      total: prevTotal + currentValue.MontoTotal,
      taxes: prevTax.Impuesto.Monto + currentValue.Impuesto.Monto
    }
  }, 0)
}

function getBillResum(opts: FrontEndRequest): Resumen {
  const sum = sumLines(opts)
  return {
    CodigoTipoMoneda: {
      CodigoMoneda: 'CRC',
      TipoCambio: '585.69'
    },
    TotalServGravados: sum.total,
    TotalServExentos: 0,
    TotalServExonerado: 0,
    TotalMercanciasGravadas: 0,
    TotalMercanciasExentas: 0,
    TotalGravado: sum.total,
    TotalExento: 0,
    TotalExonerado: 0,
    TotalVenta: sum.total,
    TotalDescuentos: 0,
    TotalVentaNeta: sum.total,
    TotalImpuesto: sum.taxes,
    TotalComprobante: sum.total + sum.taxes
  }
}

function getSender(frontEndRequest: FrontEndRequest): Persona {
  const sender = frontEndRequest.Emisor
  return {
    Nombre: sender.Nombre,
    Identificacion: {
      Tipo: sender.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion,
      Numero: sender.Identificacion.Numero
    },
    NombreComercial: sender.NombreComercial,
    Ubicacion: sender.Ubicacion,
    Telefono: sender.Telefono,
    Fax: sender.Fax,
    CorreoElectronico: sender.CorreoElectronico
  }
}

function getReceiver(frontEndRequest: FrontEndRequest): Persona {
  const receiver = frontEndRequest.Receptor
  return {
    Nombre: receiver.Nombre,
    Identificacion: {
      Tipo: receiver.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion,
      Numero: receiver.Identificacion.Numero
    },
    NombreComercial: receiver.NombreComercial,
    Ubicacion: receiver.Ubicacion
  }
}

export default async (frontEndRequest: FrontEndRequest, date: any, clave: string, consecutivo: string, options: any): Promise<any> => {
  const resum = getBillResum(frontEndRequest)
  const receiver = getReceiver(frontEndRequest)
  const sender = getSender(frontEndRequest)
  const factura: FacturaElectronicaContenedor = {
    FacturaElectronica: {
      Clave: clave,
      CodigoActividad: frontEndRequest.actividad.padStart(6, '0'),
      NumeroConsecutivo: consecutivo,
      FechaEmision: date,
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
  const XML = await genXML('FE', factura, options)
  return XML
}
