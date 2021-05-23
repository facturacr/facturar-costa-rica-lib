import { ClientPayload } from '../../types/globalInterfaces'
import { FacturaElectronicaContenedor, Resumen, Persona, Impuesto, LineaDetalle } from '../../types/facturaInterfaces'
import { genXML } from '../genXML'

// Default XML Values
const DEFAULT_VALUES = {
  key: 0,
  message: 'Default msj',
  detailsMessage: 'Default details msj',
  tipoIdentificacion: '01'
}

function sumLines(lines: LineaDetalle[]): any {
  return lines.reduce((accumulator: any, currentValue: any) => {
    const prevTotal = accumulator.MontoTotal || 0
    const prevTax = accumulator.Impuesto || { Impuesto: { Monto: 0 } }
    return {
      total: prevTotal + currentValue.MontoTotal,
      taxes: prevTax.Impuesto.Monto + currentValue.Impuesto.Monto
    }
  }, 0)
}

function getBillResum(lines: LineaDetalle[]): Resumen {
  const sum = sumLines(lines)
  return {
    CodigoTipoMoneda: {
      CodigoMoneda: 'CRC',
      TipoCambio: '585.69'
    },
    TotalServGravados: 0,
    TotalServExentos: 0,
    TotalServExonerado: 0,
    TotalMercanciasGravadas: sum.total,
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

function getSender(frontEndRequest: ClientPayload): Persona {
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

function setTaxObj(subtotal: number, taxObj: Impuesto): Impuesto {
  const tax = taxObj.Tarifa || 13
  return {
    Codigo: taxObj.Codigo,
    CodigoTarifa: taxObj.CodigoTarifa,
    Tarifa: tax,
    Monto: subtotal * (tax / 100)
  }
}

function setLinesDefaults(lines: LineaDetalle[]): LineaDetalle[] {
  return lines.map((line, index) => {
    const quantity = line.Cantidad || 1
    const total = line.PrecioUnitario * quantity
    const subtotal = total // restar descuentos
    const taxObj = setTaxObj(subtotal, line.Impuesto)
    return {
      NumeroLinea: (index + 1).toString(),
      Codigo: line.Codigo,
      Cantidad: quantity,
      UnidadMedida: line.UnidadMedida || 'Sp',
      Detalle: line.Detalle,
      PrecioUnitario: line.PrecioUnitario,
      MontoTotal: total,
      SubTotal: subtotal,
      Impuesto: taxObj,
      MontoTotalLinea: subtotal + taxObj.Monto
    }
  })
}

function getReceiver(frontEndRequest: ClientPayload): Persona {
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

export default async (frontEndRequest: ClientPayload, date: any, clave: string, consecutivo: string, options: any): Promise<any> => {
  const receiver = getReceiver(frontEndRequest)
  const sender = getSender(frontEndRequest)
  const lines = setLinesDefaults(frontEndRequest.LineasDetalle)
  const key = frontEndRequest.facturaElectronicaType || 'FacturaElectronica'
  const body = {
    Clave: clave,
    CodigoActividad: frontEndRequest.actividad.padStart(6, '0'),
    NumeroConsecutivo: consecutivo,
    FechaEmision: date,
    Emisor: sender,
    Receptor: receiver,
    CondicionVenta: '01',
    MedioPago: '01',
    DetalleServicio: {
      LineaDetalle: lines
    },
    ResumenFactura: getBillResum(lines)
  }
  const factura: FacturaElectronicaContenedor = {
    [key]: body
  }
  const XML = await genXML(key, factura, options)
  return XML
}
