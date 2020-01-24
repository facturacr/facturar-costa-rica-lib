export interface FrontEndRequest {
  senderID: string
  receiverId: string
  sale: string
  terminal: string
  typeDocument: string
  countryCode: string
  securityCode: string
  consecutive: string
  situationEC: string
  total: number
  tax: number
}

export interface ClaveOpts {
  codigoPais: string
  tipoDocumento: string
  tipoCedula: string
  cedulaEmisor: string
  situacionCE: string
  consecutivo: string
  codigoSeguridad: string
  sucursal: string
  terminal: string
}
