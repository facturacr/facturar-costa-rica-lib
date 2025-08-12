import { Clave } from './Clave'
import { FullConsecutive } from './FullConsecutive'
import { OrderLine } from './OrderLine'
import { Person } from './Person'
import { ReferenceInformation } from './ReferenceInformation'
import { SummaryProps } from './Summary.type'

export type InvoiceProps = {
  clave: Clave;
  providerId: string; // ProveedorSistemas
  fullConsecutive: FullConsecutive;
  issueDate: Date; // FechaEmision
  emitter: Person; // Emisor
  receiver?: Person; // Receptor
  orderLines: OrderLine[];
  conditionSale?: string; // CondicionVenta
  deadlineCredit?: string; // PlazoCredito
  paymentMethod?: string; // MedioPago
  summaryInvoice?: SummaryProps; // ResumenFactura
  referenceInformation?: ReferenceInformation; // InformaciónReferencia
  others?: { // Otros
    OtroTexto: string;
  };
}

type OrderLineSum = {
  totalAmount: number;
  totalTaxes: number;
  totalExempt: number;
  totalExonerated: number;
  totalNonTaxable: number;
};

export class Document {
  public readonly props: InvoiceProps
  constructor(props: InvoiceProps) {
    this.props = props
  }

  get clave(): string {
    return this.props.clave.value
  }

  get fullConsecutive(): string {
    return this.props.fullConsecutive.value
  }

  get providerId(): string {
    return this.props.providerId
  }

  get activityCode(): string {
    return this.props.emitter.activityCode
  }

  get issueDate(): Date {
    return this.props.issueDate
  }

  get emitter(): Person {
    return this.props.emitter
  }

  get receiver(): Person | undefined {
    return this.props.receiver
  }

  get orderLines(): OrderLine[] {
    return this.props.orderLines
  }

  get conditionSale(): string | undefined {
    return this.props.conditionSale
  }

  get deadlineCredit(): string | undefined {
    return this.props.deadlineCredit
  }

  get paymentMethod(): string | undefined {
    return this.props.paymentMethod
  }

  get others(): { OtroTexto: string } | undefined {
    return this.props.others
  }

  get summaryInvoice(): SummaryProps {
    if (this.props.summaryInvoice) {
      return this.props.summaryInvoice
    }
    const servicesLinesSum = this.sumServicesLines()
    const merchandiseLinesSum = this.sumMerchandiseLines()
    const allLinesSum = this.sumOrderLines()

    // Lógica para calcular los totales del resumen
    const totalEncumberedServices = servicesLinesSum.totalAmount - servicesLinesSum.totalExempt - servicesLinesSum.totalExonerated - servicesLinesSum.totalNonTaxable
    const totalEncumberedMerchandise = merchandiseLinesSum.totalAmount - merchandiseLinesSum.totalExempt - merchandiseLinesSum.totalExonerated - merchandiseLinesSum.totalNonTaxable

    const totalEncumbered = totalEncumberedServices + totalEncumberedMerchandise
    const totalExempt = allLinesSum.totalExempt
    const totalExonerated = allLinesSum.totalExonerated
    const totalNonTaxable = allLinesSum.totalNonTaxable

    const totalSale = totalEncumbered + totalExempt + totalExonerated + totalNonTaxable

    const totalDiscounts = 0 // Asumimos 0 si no se calcula
    const totalNetSale = totalSale - totalDiscounts
    const totalTaxes = allLinesSum.totalTaxes
    const totalVoucher = totalNetSale + totalTaxes

    return {
      currency: {
        code: 'CRC',
        exchangeRate: '1'
      },
      totalExemptServices: servicesLinesSum.totalExempt,
      totalEncumberedServices,
      totalExonerated,
      totalTaxedServices: servicesLinesSum.totalTaxes,
      totalTaxes,
      totalDiscounts: 0,
      totalEncumberedMerchandise,
      totalTaxed: allLinesSum.totalTaxes,
      totalExemptMerchandise: merchandiseLinesSum.totalExempt,
      totalExempt,
      totalNetSale,
      totalEncumbered,
      totalTaxBreakdown: [], // La lógica del desglose de impuestos está en `billDocToAtv.ts`
      totalSale,
      totalVoucher,
      // Se añaden los campos para 'No Sujeto' que estaban causando errores
      totalNonTaxable,
      totalNonTaxableServices: servicesLinesSum.totalNonTaxable,
      totalNonTaxableMerchandise: merchandiseLinesSum.totalNonTaxable
    }
  }

  get referenceInformation(): ReferenceInformation | undefined {
    return this.props.referenceInformation
  }

  private isAService(orderLine: OrderLine): boolean {
    const servicesMeasurementUnits = ['Sp', 'St', 'Spe']
    return servicesMeasurementUnits.includes(orderLine.measureUnit)
  }

  private isTaxable(orderLine: OrderLine): boolean {
    if (!orderLine.tax || orderLine.tax.amount === undefined || orderLine.tax.amount === null) {
      return false
    }
    return orderLine.tax.code === '01' && orderLine.tax.amount > 0
  }

  private isExempt(orderLine: OrderLine): boolean {
    // 32 El código 10, Tarifa Exenta Ley 9635, Articulo 8
    return orderLine.tax?.rateCode === '10'
  }

  private isExonerated(orderLine: OrderLine): boolean {
    return orderLine.tax?.rateCode === '01'
  }

  private isNonTaxable(orderLine: OrderLine): boolean {
    // Un ítem es "No Sujeto" si su tax.code NO es '01' o si el monto del impuesto es 0.
    // Esto cubrirá el caso donde un ítem con tax.code '01' y tarifa '0' sea considerado "No Sujeto".
    return orderLine.tax?.rateCode === '01'
  }

  private sumLines(lines: OrderLine[]): OrderLineSum {
    return lines.reduce<OrderLineSum>((previousValue, currentValue) => {
      const totalAmount = previousValue.totalAmount + currentValue.totalAmount
      const totalTaxes = previousValue.totalTaxes + (this.isTaxable(currentValue) ? (currentValue.tax?.amount ?? 0) : 0)
      const totalExempt = previousValue.totalExempt + (this.isExempt(currentValue) ? currentValue.totalAmount : 0)
      const totalExonerated = previousValue.totalExonerated + (this.isExonerated(currentValue) ? currentValue.totalAmount : 0)
      const totalNonTaxable = previousValue.totalNonTaxable + (this.isNonTaxable(currentValue) ? currentValue.totalAmount : 0)

      return {
        totalAmount,
        totalTaxes,
        totalExempt,
        totalExonerated,
        totalNonTaxable
      }
    }, { totalAmount: 0, totalTaxes: 0, totalExempt: 0, totalExonerated: 0, totalNonTaxable: 0 })
  }

  sumServicesLines(): OrderLineSum {
    return this.sumLines(this.orderLines.filter(this.isAService))
  }

  sumMerchandiseLines(): OrderLineSum {
    return this.sumLines(this.orderLines.filter((ol) => !this.isAService(ol)))
  }

  sumOrderLines(): OrderLineSum {
    return this.sumLines(this.orderLines)
  }

  public static create(props: InvoiceProps): Document {
    return new Document(props)
  }
}
