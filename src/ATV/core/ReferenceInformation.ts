export type ReferenceInformationProps = {
  docType: string;
  refNumber: string;
  issueDate: Date;
  code: string;
  reason: string;
}

export class ReferenceInformation {
  private props: ReferenceInformationProps

  constructor(props: ReferenceInformationProps) {
    this.props = props
  }

  get docType(): string {
    return this.props.docType;
  }

  get refNumber(): string {
    return this.props.refNumber;
  }

  get issueDate(): Date {
    return this.props.issueDate;
  }

  get code(): string {
    return this.props.code;
  }

  get reason(): string {
    return this.props.reason;
  }

  public static create(props: ReferenceInformationProps): ReferenceInformation {
    return new ReferenceInformation({
      ...props,
    })
  }
}
