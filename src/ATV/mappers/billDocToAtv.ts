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
    const impuestoMonto = orderLine.tax ? parseAtvMoneyFormat(orderLine.tax.amount ?? 0) : 0
    return {
      NumeroLinea: orderLine.lineNumber,
      CodigoCABYS: orderLine.code,
      // CodigoComercial
      Cantidad: orderLine.quantity,
      UnidadMedida: orderLine.measureUnit,
      // UnidadMedidaComercial
      Detalle: orderLine.detail,
      PrecioUnitario: orderLine.unitaryPrice,
      MontoTotal: orderLine.totalAmount,
      // Descuento
      SubTotal: orderLine.subTotal,
      BaseImponible: orderLine.subTotal,
      ...(orderLine.tax && {
        Impuesto: {
          Codigo: orderLine.tax.code,
          CodigoTarifaIVA: orderLine.tax.rateCode,
          Tarifa: orderLine.tax.rate,
          Monto: impuestoMonto
          // Exoneracion is explicitly excluded here
        }
      }),
      ImpuestoAsumidoEmisorFabrica: 0,
      // @ts-expect-error pending-to-fix
      ImpuestoNeto: parseAtvMoneyFormat(orderLine.tax.amount),
      MontoTotalLinea: parseAtvMoneyFormat(orderLine.totalOrderLineAmount)
    }
  })
  return { LineaDetalle }
}

const mapSummaryInvoice = (document: DomainDocument): Resumen => {
  const summaryInvoice = document.summaryInvoice
  const orderLines = document.orderLines // Still need access to order lines for breakdown

  // --- Lógica para TotalDesgloseImpuesto (sin considerar exoneraciones) ---
  const taxBreakdownMap = new Map<string, number>()

  orderLines.forEach(orderLine => {
    if (orderLine.tax?.amount !== undefined && orderLine.tax.amount !== null && orderLine.tax.amount > 0) {
      const key = `${orderLine.tax.code}-${orderLine.tax.rateCode}`
      const currentTotal = taxBreakdownMap.get(key) || 0
      taxBreakdownMap.set(key, currentTotal + orderLine.tax.amount)
    }
  })

  const TotalDesgloseImpuesto = Array.from(taxBreakdownMap.entries()).map(([key, totalMonto]) => {
    const [Codigo, CodigoTarifaIVA, Tarifa] = key.split('-')
    return {
      Codigo,
      CodigoTarifaIVA,
      Tarifa,
      TotalMontoImpuesto: parseAtvMoneyFormat(totalMonto)
    }
  })
  return {
    CodigoTipoMoneda: {
      // @ts-expect-error pending-to-fix
      CodigoMoneda: summaryInvoice.currency.code,
      // @ts-expect-error pending-to-fix
      TipoCambio: summaryInvoice.currency.exchangeRate
    },
    TotalServGravados: parseAtvMoneyFormat(summaryInvoice.totalEncumberedServices),
    TotalServExentos: parseAtvMoneyFormat(summaryInvoice.totalExemptServices),
    TotalServNoSujeto: parseAtvMoneyFormat(summaryInvoice.totalNonTaxableServices), // Moved here
    // @ts-expect-error pending-to-fix
    TotalMercanciasGravadas: parseAtvMoneyFormat(summaryInvoice.totalEncumberedMerchandise),
    // @ts-expect-error pending-to-fix
    TotalMercanciasExentas: parseAtvMoneyFormat(summaryInvoice.totalExemptMerchandise),
    TotalMercNoSujeta: parseAtvMoneyFormat(summaryInvoice.totalNonTaxableMerchandise), // Moved here
    TotalGravado: parseAtvMoneyFormat(summaryInvoice.totalEncumbered),
    TotalExento: parseAtvMoneyFormat(summaryInvoice.totalExempt),
    TotalNoSujeto: parseAtvMoneyFormat(summaryInvoice.totalNonTaxable), // Moved here
    TotalVenta: parseAtvMoneyFormat(summaryInvoice.totalSale),
     // @ts-expect-error pending-to-fix
    TotalDescuentos: parseAtvMoneyFormat(summaryInvoice.totalDiscounts),
    // @ts-expect-error pending-to-fix
    TotalVentaNeta: parseAtvMoneyFormat(summaryInvoice.totalNetSale),
    TotalDesgloseImpuesto,
    TotalImpuesto: parseAtvMoneyFormat(summaryInvoice.totalTaxes),
    TotalImpAsumEmisorFabrica: 0,
    TotalOtrosCargos: 0,
    MedioPago: {
      // @ts-expect-error pending-to-fix
      TipoMedioPago: document.paymentMethod
    },
    TotalComprobante: parseAtvMoneyFormat(summaryInvoice.totalVoucher),
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
    CorreoElectronico: undefined
  }
  // @ts-expect-error pending-to-fix
  atvPerson.Ubicacion = person.location
    ? {
      Provincia: person.location?.province,
      Canton: person.location?.canton?.padStart(2, '0'),
      Distrito: person.location?.district?.padStart(2, '0'),
      Barrio: person.location?.neighborhood?.padStart(5, '0'),
      OtrasSenas: person.location?.details
    }
    : undefined
  // @ts-expect-error pending-to-fix
  atvPerson.Telefono = person.phone
    ? {
      CodigoPais: person.phone?.countryCode,
      NumTelefono: person.phone?.number
    }
    : undefined
  // @ts-expect-error pending-to-fix
  atvPerson.CorreoElectronico = person.email

  return atvPerson
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
    ...(document.receiver && { // TODO add && document.name === 'FacturaElectronica'
      CodigoActividadReceptor: document.receiver?.activityCode?.padStart(6, '0')
    }),
    NumeroConsecutivo: document.fullConsecutive,
    FechaEmision: document.issueDate.toISOString(),
    Emisor: mapPerson(document.emitter),
    ...(document.receiver && {
      Receptor: mapPerson(document.receiver)
    }),
    CondicionVenta: document.conditionSale,
    PlazoCredito: document.deadlineCredit,
    DetalleServicio: mapOrderLinesToAtvFormat(document.orderLines),
    ResumenFactura: mapSummaryInvoice(document),
    Otros: document.others
  }
  if (document.referenceInformation) {
    doc.InformacionReferencia = mapReferenceInformation(document.referenceInformation)
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
