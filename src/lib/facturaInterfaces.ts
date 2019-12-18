export interface DetalleServicio {
  LineaDetalle: {
    NumeroLinea: number;
    Cantidad: number;
    UnidadMedida: string;
    Detalle: string;
    PrecioUnitario: number;
    MontoTotal: number;
    SubTotal: number;
    BaseImponible: number;
    MontoTotalLinea: number;
  };
}

export interface Resumen {
  CodigoTipoMoneda: {
    CodigoMoneda: string;
    TipoCambio: string;
  };
  TotalServGravados: number;
  TotalServExentos: number;
  TotalMercanciasGravadas: number;
  TotalMercanciasExentas: number;
  TotalGravado: number;
  TotalExento: number;
  TotalVenta: number;
  TotalDescuentos: number;
  TotalVentaNeta: number;
  TotalImpuesto: number;
  TotalComprobante: number;
}

export interface Persona {
  Nombre: string;
  Identificacion: {
    Tipo: string;
    Numero: string;
  };
  NombreComercial: string;
  Ubicacion?: {
    Provincia: string;
    Canton: string;
    Distrito: string;
    Barrio: string;
    OtrasSenas: string;
  };
  Telefono: {
    CodigoPais: string;
    NumTelefono: string;
  };
  Fax?: {
    CodigoPais: string;
    NumTelefono: string;
  };
  CorreoElectronico: string;
}

export interface FacturaElectronica {
  Clave: number;
  CodigoActividad: number;
  NumeroConsecutivo: number;
  FechaEmision: Date;
  Emisor: Persona;
  Receptor: Persona;
  CondicionVenta: number;
  PlazoCredito: number;
  MedioPago: number;
  DetalleServicio: DetalleServicio;
  ResumenFactura: Resumen;
  Otros: {
    OtroTexto: string;
  };
}
