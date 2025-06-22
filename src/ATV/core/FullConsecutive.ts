import { consecutivoStr } from '@src/lib/genClave'
import { DocumentTypeValues } from './DocumentType';

type FullConsecutiveProps = {
  consecutiveIdentifier: string;
  documentType: DocumentTypeValues;
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
