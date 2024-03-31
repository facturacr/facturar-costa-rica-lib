import { consecutivoStr } from '@src/lib/genClave'

type FullConsecutiveProps = {
  consecutiveIdentifier: string;
  documentType?: string;
  branch?: string;
  terminal?: string;
}

export class FullConsecutive {
  private props: FullConsecutiveProps

  get value(): string {
    return consecutivoStr({
      tipoDocKey: this.props.documentType,
      sucursal: this.props.branch,
      terminal: this.props.terminal,
      consecutivo: this.props.consecutiveIdentifier
    })
  }

  constructor(props: FullConsecutiveProps) {
    this.props = props
  }

  public static create(props: FullConsecutiveProps): FullConsecutive {
    return new FullConsecutive(props)
  }
}
