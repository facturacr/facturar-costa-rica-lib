import { FrontEndRequest, FinalMessagePerson } from '../types/globalInterfaces'
import { Resumen, Persona } from '../types/facturaInterfaces'

const DEFAULT_VALUES = {
  key: 0,
  message: 'Default msj',
  detailsMessage: 'Default details msj',
  taxes: 100,
  tipoIdentificacion: '01'
}

export function getSimpleSender(frontEndRequest: FrontEndRequest): FinalMessagePerson {
  const sender = frontEndRequest.Emisor
  return {
    tipoIdentificacion: sender.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion,
    numeroIdentificacion: sender.Identificacion.Numero
  }
}

export function getSimpleReceiver(frontEndRequest: FrontEndRequest): FinalMessagePerson {
  const receiver = frontEndRequest.Receptor
  return {
    tipoIdentificacion: receiver.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion,
    numeroIdentificacion: receiver.Identificacion.Numero
  }
}

function calculateTaxes(billTotal: number, billTaxes: number): number {
  const taxes = typeof billTaxes === 'number' ? billTaxes : DEFAULT_VALUES.taxes
  return billTotal * taxes
}

export function getBillResum(frontEndRequest: FrontEndRequest): Resumen {
  const taxes = calculateTaxes(frontEndRequest.total, frontEndRequest.impuesto)
  return {
    CodigoTipoMoneda: {
      CodigoMoneda: 'CRC',
      TipoCambio: '585.69'
    },
    TotalServGravados: 0,
    TotalServExentos: 0,
    TotalServExonerado: 0,
    TotalMercanciasGravadas: frontEndRequest.total,
    TotalMercanciasExentas: 0,
    TotalGravado: frontEndRequest.total,
    TotalExento: 0,
    TotalExonerado: 0,
    TotalVenta: frontEndRequest.total,
    TotalDescuentos: 0,
    TotalVentaNeta: frontEndRequest.total,
    TotalImpuesto: taxes,
    TotalComprobante: frontEndRequest.total + taxes
  }
}

export function getSender(frontEndRequest: FrontEndRequest): Persona {
  const sender = frontEndRequest.Emisor
  return {
    Nombre: sender.Nombre,
    Identificacion: {
      Tipo: sender.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion,
      Numero: sender.Identificacion.Numero
    },
    NombreComercial: sender.Nombre,
    Ubicacion: sender.Ubicacion,
    Telefono: {
      CodigoPais: sender.Telefono.CodigoPais,
      NumTelefono: sender.Telefono.NumTelefono
    },
    Fax: {
      CodigoPais: sender.Telefono.CodigoPais,
      NumTelefono: sender.Telefono.NumTelefono
    },
    CorreoElectronico: sender.CorreoElectronico
  }
}

export function getReceiver(frontEndRequest: FrontEndRequest): Persona {
  const receiver = frontEndRequest.Receptor
  return {
    Nombre: receiver.Nombre,
    Identificacion: {
      Tipo: receiver.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion,
      Numero: receiver.Identificacion.Numero
    },
    NombreComercial: receiver.NombreComercial,
    Ubicacion: receiver.Ubicacion,
    Telefono: receiver.Telefono,
    Fax: receiver.Fax,
    CorreoElectronico: receiver.CorreoElectronico
  }
}
