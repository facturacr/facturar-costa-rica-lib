type ReceptorConsecutiveProps = {
    branch: string; // sucursal
    terminal: string; // terminal
    documentType: '05' | '06' | '07'; // 05=aceptación, 06=aceptación parcial, 07=rechazo
    consecutive: string;
}

export class ReceptorConsecutive {
  private props: ReceptorConsecutiveProps

  constructor(props: ReceptorConsecutiveProps) {
    this.props = props
  }

  get value(): string {
    return Object.values(this.props).join('')
  }

  public static create(props: ReceptorConsecutiveProps): ReceptorConsecutive {
    return new ReceptorConsecutive({
      branch: props.branch.padStart(3, '0'),
      terminal: props.terminal.padStart(5, '0'),
      documentType: props.documentType,
      consecutive: props.consecutive.padStart(10, '0')
    })
  }
}
