import { Clave } from './Clave'
import { FullConsecutive } from './FullConsecutive'
import { OrderLine } from './OrderLine'
import { Person } from './Person'

export type SummaryProps = {
  currency?: {
    code: string;
    exchangeRate: string;
  };
  totalTaxedServices: number; // TotalServGravados
  totalExemptServices: number; // TotalServExentos
  totalEncumberedServices: number; // TotalServExonerado
  totalExemptMerchandise?: number; // TotalMercanciasGravadas
  totalEncumberedMerchandise?: number; // TotalMercanciasExentas
  totalEncumbered: number; // TotalGravado
  totalTaxed?: number;
  totalExempt: number; // TotalExento
  totalExonerated: number; // TotalExonerado
  totalSale: number; // TotalVenta
  totalDiscounts?: number; // TotalDescuentos
  totalNetSale?: number; // TotalVentaNeta
  totalTaxes: number; // TotalImpuesto
  totalVoucher: number; // TotalComprobante
}

export type DocumentProps = {
  clave: Clave;
  fullConsecutive: FullConsecutive;
  activityCode: string; // CodigoActividad
  issueDate: Date; // FechaEmision
  emitter: Person; // Emisor
  receiver: Person; // Receptor
  orderLines: OrderLine[];
  conditionSale?: string; // CondicionVenta
  deadlineCredit?: string; // PlazoCredito
  paymentMethod?: string; // MedioPago
  summaryInvoice?: SummaryProps; // ResumenFactura
  others?: { // Otros
    OtroTexto: string;
  };
}

type OrderLineSum = {
  totalAmount: number;
  totalTaxes: number;
}

export class Document {
  public readonly props: DocumentProps;
  constructor(props: DocumentProps) {
    this.props = props
  }

  get clave(): string {
    return this.props.clave.value
  }

  get fullConsecutive(): string {
    return this.props.fullConsecutive.value
  }

  get activityCode(): string {
    return this.props.activityCode
  }

  get issueDate(): Date {
    return this.props.issueDate
  }

  get emitter(): Person {
    return this.props.emitter
  }

  get receiver(): Person {
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
    const orderLineSumResult = this.sumCreditLines()
    const summary = {
      currency: {
        code: 'CRC',
        exchangeRate: '585.69'
      },
      totalExemptServices: 0,
      totalEncumberedServices: 0,
      totalExonerated: 0,
      totalTaxedServices: 0,
      totalTaxes: orderLineSumResult.totalTaxes,
      totalDiscounts: 0,
      totalEncumberedMerchandise: orderLineSumResult.totalAmount,
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

  sumCreditLines(): OrderLineSum {
    return this.orderLines.reduce<OrderLineSum>((previousValue, currentValue) => {
      return {
        totalAmount: previousValue.totalAmount + currentValue.totalAmount,
        totalTaxes: previousValue.totalTaxes + currentValue.tax.amount
      }
    }, { totalAmount: 0, totalTaxes: 0 })
  }

  public static create(props: DocumentProps): Document {
    return new Document(props)
  }
}
