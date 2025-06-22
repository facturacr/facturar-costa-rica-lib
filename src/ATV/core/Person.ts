export type LocationProps = {
  province: '1' | '2' | '3' | '4' | '5' | '6' | '7';
  canton: string;
  district: string;
  neighborhood: string;
  details?: string;
}

export type PhoneProps = {
  countryCode: string;
  number: string;
}

export type PersonProps = {
  fullName: string;
  identifier: {
    type: '01' | '02';
    id: string;
  };
  commercialName: string;
  activityCode: string;
  location?: LocationProps;
  phone?: PhoneProps;
  fax?: PhoneProps;
  email?: string;
}

export class Person {
  props: PersonProps
  constructor(props: PersonProps) {
    this.props = props
  }

  get fullName(): string {
    return this.props.fullName
  }

  get identifierType(): '01' | '02' | undefined {
    return this.props.identifier.type
  }

  get identifierId(): string {
    return this.props.identifier.id
  }

  get commercialName(): string {
    return this.props.commercialName
  }

  get activityCode(): string {
    return this.props.activityCode
  }

  get location(): LocationProps | undefined {
    return this.props.location
  }

  get phone(): PhoneProps | undefined {
    return this.props.phone
  }

  get fax(): PhoneProps | undefined {
    return this.props.fax
  }

  get email(): string | undefined {
    return this.props.email
  }

  public static create(props: PersonProps): Person {
    return new Person(props)
  }
}
