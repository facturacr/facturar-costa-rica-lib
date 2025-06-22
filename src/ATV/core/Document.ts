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
  receiver: Person; // Receptor
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
}

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
    const orderLineSumResult = this.sumOrderLines()
    const servicesLineSumResult = this.sumServicesLines()
    const merchandiseLineSumResult = this.sumMerchandiseLines()
    const summary = {
      currency: {
        code: 'CRC',
        exchangeRate: '585.69'
      },
      totalExemptServices: 0,
      totalEncumberedServices: servicesLineSumResult.totalAmount,
      totalExonerated: 0,
      totalTaxedServices: servicesLineSumResult.totalTaxes,
      totalTaxes: orderLineSumResult.totalTaxes,
      totalDiscounts: 0,
      totalEncumberedMerchandise: merchandiseLineSumResult.totalAmount,
      totalTaxed: orderLineSumResult.totalTaxes,
      totalExemptMerchandise: 0,
      totalExempt: 0,
      totalNetSale: orderLineSumResult.totalAmount,
      totalEncumbered: orderLineSumResult.totalAmount
    }
    const totalSale = summary.totalEncumbered + summary.totalExempt + summary.totalExonerated
    return {
      ...summary,
      totalSale,
      totalNetSale: totalSale - summary.totalDiscounts,
      totalVoucher: summary.totalNetSale + summary.totalTaxed
    }
  }

  get referenceInformation(): ReferenceInformation | undefined {
    return this.props.referenceInformation
  }

  private isAService(orderLine: OrderLine): boolean {
    const servicesMeasurementUnits = ['Sp', 'St', 'Spe']
    return servicesMeasurementUnits.includes(orderLine.measureUnit)
  }

  sumServicesLines(): OrderLineSum {
    return this.orderLines.filter(this.isAService).reduce<OrderLineSum>((previousValue, currentValue) => {
      return {
        totalAmount: previousValue.totalAmount + currentValue.totalAmount,
        totalTaxes: previousValue.totalTaxes + currentValue.tax.amount
      }
    }, { totalAmount: 0, totalTaxes: 0 })
  }

  sumMerchandiseLines(): OrderLineSum {
    return this.orderLines.filter((ol) => !this.isAService(ol)).reduce<OrderLineSum>((previousValue, currentValue) => {
      return {
        totalAmount: previousValue.totalAmount + currentValue.totalAmount,
        totalTaxes: previousValue.totalTaxes + currentValue.tax.amount
      }
    }, { totalAmount: 0, totalTaxes: 0 })
  }

  sumOrderLines(): OrderLineSum {
    return this.orderLines.reduce<OrderLineSum>((previousValue, currentValue) => {
      return {
        totalAmount: previousValue.totalAmount + currentValue.totalAmount,
        totalTaxes: previousValue.totalTaxes + currentValue.tax.amount
      }
    }, { totalAmount: 0, totalTaxes: 0 })
  }

  public static create(props: InvoiceProps): Document {
    return new Document(props)
  }
}
