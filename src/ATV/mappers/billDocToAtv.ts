import { AtvDocument, InvoiceDocumentContainer, DetalleServicio, Resumen, Persona, InformacionReferencia } from '@src/types/facturaInterfaces'
import { Document as DomainDocument } from '../core/Document'
import { OrderLine } from '../core/OrderLine'
import { Person } from '../core/Person'
import { ReferenceInformation } from '../core/ReferenceInformation'
import { ReceptorMessageProps } from '../core/types'

type AtvFormat = InvoiceDocumentContainer

const parseAtvMoneyFormat = (amount: number) => {
  return parseFloat(amount.toFixed(5))
}

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
        Monto: parseAtvMoneyFormat(orderLine.tax.amount)
      },
      // ImpuestoNeto
      MontoTotalLinea: parseAtvMoneyFormat(orderLine.totalOrderLineAmount)
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
    TotalServGravados: parseAtvMoneyFormat(summaryInvoice.totalEncumberedServices),
    TotalServExentos: parseAtvMoneyFormat(summaryInvoice.totalExemptServices),
    TotalMercanciasGravadas: parseAtvMoneyFormat(summaryInvoice.totalEncumberedMerchandise),
    TotalMercanciasExentas: parseAtvMoneyFormat(summaryInvoice.totalExemptMerchandise),
    TotalGravado: parseAtvMoneyFormat(summaryInvoice.totalEncumbered),
    TotalExento: parseAtvMoneyFormat(summaryInvoice.totalExempt),
    TotalExonerado: parseAtvMoneyFormat(summaryInvoice.totalExonerated),
    TotalVenta: parseAtvMoneyFormat(summaryInvoice.totalSale),
    TotalDescuentos: parseAtvMoneyFormat(summaryInvoice.totalDiscounts),
    TotalVentaNeta: parseAtvMoneyFormat(summaryInvoice.totalNetSale),
    TotalImpuesto: parseAtvMoneyFormat(summaryInvoice.totalTaxes),
    TotalComprobante: parseAtvMoneyFormat(summaryInvoice.totalVoucher)
  }
}

const mapPerson = (person: Person): Persona => {
  const atvPerson = {
    Nombre: person.fullName,
    Identificacion: {
      Tipo: person.identifierType,
      Numero: person.identifierId
    },
    NombreComercial: person.commercialName,
    Ubicacion: undefined,
    Telefono: undefined,
    Fax: undefined,
    CorreoElectronico: undefined
  }
  atvPerson.Ubicacion = person.location ? {
    Provincia: person.location?.province,
    Canton: person.location?.canton?.padStart(2, '0'),
    Distrito: person.location?.district?.padStart(2, '0'),
    Barrio: person.location?.neighborhood?.padStart(5, '0'),
    OtrasSenas: person.location?.details
  } : undefined
  atvPerson.Telefono = person.phone ? {
    CodigoPais: person.phone?.countryCode,
    NumTelefono: person.phone?.number
  } : undefined
  atvPerson.Fax = person.fax ? {
    CodigoPais: person.fax?.countryCode,
    NumTelefono: person.fax?.number
  } : undefined
  atvPerson.CorreoElectronico = person.email
  return atvPerson;
}

const mapReferenceInformation = (referenceInfo: ReferenceInformation): InformacionReferencia => {
  return {
    TipoDoc: referenceInfo.docType,
    Numero: referenceInfo.refNumber,
    FechaEmision: referenceInfo.issueDate.toISOString(),
    Codigo: referenceInfo.code,
    Razon: referenceInfo.reason
  }
}

export const mapDocumentToAtvFormat = (docName: string, document: DomainDocument): AtvFormat => {
  const key = docName
  const doc: AtvDocument = {
    Clave: document.clave,
    ProveedorSistemas: document.providerId,
    CodigoActividadEmisor: document.emitter.activityCode.padStart(6, '0'),
    CodigoActividadReceptor: document.receiver.activityCode.padStart(6, '0'),
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
  if (document.referenceInformation) {
    doc.InformacionReferencia = mapReferenceInformation(document.referenceInformation);
  }
  return {
    [key]: doc
  }
}

export const mapReceptorMessageToAtvFormat = (props: ReceptorMessageProps): AtvFormat => {
  return {
    MensajeReceptor: {
      Clave: props.clave,
      NumeroCedulaEmisor: props.emitterIdentifier,
      FechaEmisionDoc: props.documentIssueDate.toISOString(),
      Mensaje: props.aceptationState.toString(), // 1 Aceptado | 2 Aceptado Parcialmente | 3 Rechazado
      DetalleMensaje: props.aceptationDetailMessage,
      MontoTotalImpuesto: props.totalTaxes,
      CodigoActividad: props.activityCode,
      CondicionImpuesto: props.taxCondition,
      MontoTotalDeGastoAplicable: props.totalSale, // fullInvoice.ResumenFactura.TotalVenta, // TODO investigar casos de uso
      TotalFactura: props.totalSale, // fullInvoice.ResumenFactura.TotalVenta,
      NumeroCedulaReceptor: props.receptorIdentifier,
      NumeroConsecutivoReceptor: props.receptorConcecutive
    }
  }
}
