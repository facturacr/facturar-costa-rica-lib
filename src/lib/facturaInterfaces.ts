export interface IDetalleServicio {
  LineaDetalle: {
    NumeroLinea: Number,
    Cantidad: Number,
    UnidadMedida: String,
    Detalle: String,
    PrecioUnitario: Number,
    MontoTotal: Number,
    SubTotal: Number,
    BaseImponible: Number,
    MontoTotalLinea: Number
  }
}

export interface IResumen {
  CodigoTipoMoneda: {
    CodigoMoneda: String,
    TipoCambio: String
  },
  TotalServGravados: Number,
  TotalServExentos: Number,
  TotalMercanciasGravadas: Number,
  TotalMercanciasExentas: Number,
  TotalGravado: Number,
  TotalExento: Number,
  TotalVenta: Number,
  TotalDescuentos: Number,
  TotalVentaNeta: Number,
  TotalImpuesto: Number,
  TotalComprobante: Number
}

export interface IPersona {
  Nombre: String,
  Identificacion: {
    Tipo: String,
    Numero: String
  },
  NombreComercial: String,
  Ubicacion?: {
    Provincia: String,
    Canton: String,
    Distrito: String,
    Barrio: String,
    OtrasSenas: String
  },
  Telefono: {
    CodigoPais: String,
    NumTelefono: String
  },
  Fax?: {
    CodigoPais: String,
    NumTelefono: String
  },
  CorreoElectronico: String
}

export interface IFacturaElectronica {
  Clave: Number,
  CodigoActividad: Number,
  NumeroConsecutivo: Number,
  FechaEmision: Date,
  Emisor: IPersona,
  Receptor: IPersona,
  CondicionVenta: Number,
  PlazoCredito: Number,
  MedioPago: Number,
  DetalleServicio: IDetalleServicio,
  ResumenFactura: IResumen,
  Otros: {
    OtroTexto: String
  }
}
