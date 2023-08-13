import { Document, FacturaElectronicaContenedor, DetalleServicio, Resumen, Persona } from '@src/types/facturaInterfaces'
import { Document as DomainDocument } from '../core/Document'
import { OrderLine } from '../core/OrderLine'
import { Person } from '../core/Person'

type AtvFormat = FacturaElectronicaContenedor

const mapOrderLinesToAtvFormat = (orderLines: OrderLine[]): DetalleServicio => {
  const LineaDetalle = orderLines.map<DetalleServicio['LineaDetalle'][0]>((orderLine) => {
    return {
      NumeroLinea: orderLine.lineNumber,
      Codigo: orderLine.code,
      // CodigoComercial
      Cantidad: orderLine.quantity,
      UnidadMedida: orderLine.measureUnit,
      // UnidadMedidaComercial
      Detalle: orderLine.detail,
      PrecioUnitario: orderLine.unitaryPrice,
      MontoTotal: orderLine.totalAmount,
      // Descuento
      SubTotal: orderLine.subTotal,
      // BaseImponible
      Impuesto: {
        Codigo: orderLine.tax.code,
        CodigoTarifa: orderLine.tax.rateCode,
        Tarifa: orderLine.tax.rate,
        Monto: orderLine.tax.amount
      },
      // ImpuestoNeto
      MontoTotalLinea: orderLine.totalOrderLineAmount
    }
  })
  return { LineaDetalle }
}

const mapSummaryInvoice = (summaryInvoice: DomainDocument['summaryInvoice']): Resumen => {
  return {
    CodigoTipoMoneda: {
      CodigoMoneda: summaryInvoice.currency.code,
      TipoCambio: summaryInvoice.currency.exchangeRate
    },
    TotalServGravados: summaryInvoice.totalEncumberedServices,
    TotalServExentos: summaryInvoice.totalExemptServices,
    TotalMercanciasGravadas: summaryInvoice.totalEncumberedMerchandise,
    TotalMercanciasExentas: summaryInvoice.totalExemptMerchandise,
    TotalGravado: summaryInvoice.totalEncumbered,
    TotalExento: summaryInvoice.totalExempt,
    TotalExonerado: summaryInvoice.totalExonerated,
    TotalVenta: summaryInvoice.totalSale,
    TotalDescuentos: summaryInvoice.totalDiscounts,
    TotalVentaNeta: summaryInvoice.totalNetSale,
    TotalImpuesto: summaryInvoice.totalTaxes,
    TotalComprobante: summaryInvoice.totalVoucher
  }
}

const mapPerson = (person: Person): Persona => {
  return {
    Nombre: person.fullName,
    Identificacion: {
      Tipo: person.identifierType,
      Numero: person.identifierId
    },
    NombreComercial: person.commercialName,
    Ubicacion: {
      Provincia: person.location?.province,
      Canton: person.location?.canton.padStart(2, '0'),
      Distrito: person.location?.district.padStart(2, '0'),
      Barrio: person.location?.neighborhood.padStart(2, '0'),
      OtrasSenas: person.location?.details
    },
    Telefono: {
      CodigoPais: person.phone?.countryCode,
      NumTelefono: person.phone?.number
    },
    Fax: {
      CodigoPais: person.fax?.countryCode,
      NumTelefono: person.fax?.number
    },
    CorreoElectronico: person.email
  }
}

export const mapDocumentToAtvFormat = (docName: string, document: DomainDocument): AtvFormat => {
  const key = docName
  const doc: Document = {
    Clave: document.clave,
    CodigoActividad: document.activityCode.padStart(6, '0'),
    NumeroConsecutivo: document.fullConsecutive,
    FechaEmision: document.issueDate.toISOString(),
    Emisor: mapPerson(document.emitter),
    Receptor: mapPerson(document.receiver),
    CondicionVenta: document.conditionSale,
    PlazoCredito: document.deadlineCredit,
    MedioPago: document.paymentMethod,
    DetalleServicio: mapOrderLinesToAtvFormat(document.orderLines),
    ResumenFactura: mapSummaryInvoice(document.summaryInvoice),
    Otros: document.others
  }
  return {
    [key]: doc
  }
}
