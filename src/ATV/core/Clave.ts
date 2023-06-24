import { genClaveObj, genString } from '@src/lib/genClave'

type ClaveProps = {
  countryCode: string; // codigoPais
  docKeyType: string; // tipoDocKey
  identifierType: string; // tipoCedula
  emitterIdentifier: string; // cedulaEmisor
  ceSituation: string; // situacionCE
  consecutiveIdentifier: string; // consecutivo
  securityCode: string; // codigoSeguridad
  branch: string; // sucursal
  terminal: string; // terminal
}

export class Clave {
  private props: ClaveProps;

  get value(): string {
    const claveObj = genClaveObj({
      cedulaEmisor: this.props.emitterIdentifier,
      codigoPais: this.props.countryCode,
      codigoSeguridad: this.props.securityCode,
      consecutivo: this.props.consecutiveIdentifier,
      situacionCE: this.props.ceSituation,
      sucursal: this.props.branch,
      terminal: this.props.terminal,
      tipoCedula: this.props.identifierType,
      tipoDocKey: this.props.docKeyType
    })
    const claveStr = genString(claveObj)
    return claveStr
  }

  constructor(props: ClaveProps) {
    this.props = props
  }

  public static create(props: ClaveProps): Clave {
    return new Clave(props)
  }
}
