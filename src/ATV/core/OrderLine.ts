type TaxProps = {
  code: string;
  rateCode: string;
  rate: number;
  amount?: number;
}

type OrderLineProps = {
  detail: string;
  unitaryPrice: number;
  lineNumber?: string;
  code?: string; // CAByS - https://www.bccr.fi.cr/seccion-indicadores-economicos/cat%C3%A1logo-de-bienes-y-servicios
  quantity?: number;
  measureUnit?: string;
  totalAmount?: number;
  subTotal?: number;
  tax?: TaxProps;
  totalOrderLineAmount?: number;
  // BaseImponible?: number;
}

export class OrderLine {
  props: OrderLineProps

  constructor(props: OrderLineProps) {
    this.props = props
  }

  get detail(): string {
    return this.props.detail
  }

  get unitaryPrice(): number {
    return this.props.unitaryPrice
  }

  get lineNumber(): string | undefined {
    return this.props.lineNumber
  }

  get code(): string | undefined {
    return this.props.code
  }

  get quantity(): number {
    return this.props.quantity || 1
  }

  get measureUnit(): string {
    return this.props.measureUnit || 'Sp'
  }

  get subTotal(): number {
    return this.props.subTotal || this.props.unitaryPrice * this.quantity // subtract discounts
  }

  get totalAmount(): number {
    return this.props.totalAmount || this.props.unitaryPrice * this.quantity
  }

  get totalOrderLineAmount(): number {
    return this.props.totalOrderLineAmount || this.subTotal + (this.tax?.amount ?? 0)
  }

  get tax(): TaxProps {
    // @ts-expect-error pending-to-fix
    const rate = this.props.tax.rate
    return {
      rate,
      // @ts-expect-error pending-to-fix
      code: this.props.tax.code,
      // @ts-expect-error pending-to-fix
      rateCode: this.props.tax.rateCode,
      amount: this.subTotal * (rate / 100)
    }
  }

  public static create(props: OrderLineProps): OrderLine {
    const orderLineProps = {
      lineNumber: props.lineNumber,
      code: props.code,
      quantity: props.quantity || 1,
      measureUnit: props.measureUnit || 'Sp',
      detail: props.detail,
      unitaryPrice: props.unitaryPrice,
      totalAmount: props.totalAmount
    }
    const tax: TaxProps = {
      // @ts-expect-error pending-to-fix
      code: props.tax.code,
      // @ts-expect-error pending-to-fix
      rate: typeof props.tax.rate === 'number' ? props.tax.rate : 13,
      // @ts-expect-error pending-to-fix
      rateCode: props.tax.rateCode
    }
    return new OrderLine({
      ...orderLineProps,
      tax
    })
  }
}
