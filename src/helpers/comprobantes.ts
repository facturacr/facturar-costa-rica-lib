import { ClientPayload, FinalMessagePerson } from '@src/types/globalInterfaces'
import { Resumen, Persona } from '@src/types/facturaInterfaces'

const DEFAULT_VALUES = {
  key: 0,
  message: 'Default msj',
  detailsMessage: 'Default details msj',
  taxes: 100,
  tipoIdentificacion: '01' as Persona['Identificacion']['Tipo']
}

export function getSimpleSender(frontEndRequest: ClientPayload): FinalMessagePerson {
  const sender = frontEndRequest.Emisor
  return {
    // @ts-expect-error pending-to-fix
    tipoIdentificacion: sender.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion,
    numeroIdentificacion: sender.Identificacion.Numero
  }
}

export function getSimpleReceiver(frontEndRequest: ClientPayload): FinalMessagePerson {
  const receiver = frontEndRequest.Receptor
  return {
    // @ts-expect-error pending-to-fix
    tipoIdentificacion: receiver.Identificacion.Tipo || DEFAULT_VALUES.tipoIdentificacion,
    numeroIdentificacion: receiver.Identificacion.Numero
  }
}

function calculateTaxes(billTotal: number, billTaxes: number): number {
  const taxes = typeof billTaxes === 'number' ? billTaxes : DEFAULT_VALUES.taxes
  return billTotal * taxes
}

export function getBillResum(frontEndRequest: ClientPayload): Resumen {
  // @ts-expect-error pending-to-fix
  const taxes = calculateTaxes(frontEndRequest.total, frontEndRequest.impuesto)
  return {
    CodigoTipoMoneda: {
      CodigoMoneda: 'CRC',
      TipoCambio: '1'
    },
    TotalServGravados: 0,
    TotalServExentos: 0,
    // TotalServExonerado: 0,
    TotalMercanciasGravadas: frontEndRequest.total,
    TotalMercanciasExentas: 0,
    TotalGravado: frontEndRequest.total,
    TotalExento: 0,
    TotalExonerado: 0,
    // @ts-expect-error pending-to-fix
    TotalVenta: frontEndRequest.total,
    TotalDescuentos: 0,
    TotalVentaNeta: frontEndRequest.total,
    TotalImpuesto: taxes,
    // @ts-expect-error pending-to-fix
    TotalComprobante: frontEndRequest.total + taxes
  }
}

export function getSender(frontEndRequest: ClientPayload): Persona {
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
      // @ts-expect-error pending-to-fix
      CodigoPais: sender.Telefono.CodigoPais,
      // @ts-expect-error pending-to-fix
      NumTelefono: sender.Telefono.NumTelefono
    },
    Fax: {
      // @ts-expect-error pending-to-fix
      CodigoPais: sender.Telefono.CodigoPais,
      // @ts-expect-error pending-to-fix
      NumTelefono: sender.Telefono.NumTelefono
    },
    CorreoElectronico: sender.CorreoElectronico
  }
}

export function getReceiver(frontEndRequest: ClientPayload): Persona {
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
