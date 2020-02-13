export interface Impuesto {
  Codigo: string;
  CodigoTarifa: string;
  Tarifa: number;
  Monto?: number;
}

export interface LineaDetalle {
  NumeroLinea?: string;
  Cantidad?: number;
  UnidadMedida?: string;
  Detalle: string;
  PrecioUnitario: number;
  MontoTotal?: number;
  SubTotal?: number;
  BaseImponible?: number;
  Impuesto: Impuesto;
  MontoTotalLinea?: number;
}

export interface DetalleServicio {
  LineaDetalle: Array<LineaDetalle>;
}

export interface Resumen {
  CodigoTipoMoneda?: {
    CodigoMoneda: string;
    TipoCambio: string;
  };
  TotalServGravados: number;
  TotalServExentos: number;
  TotalServExonerado: number;
  TotalMercanciasGravadas?: number;
  TotalMercanciasExentas?: number;
  TotalGravado?: number;
  TotalExento: number;
  TotalExonerado: number;
  TotalVenta: number;
  TotalDescuentos?: number;
  TotalVentaNeta?: number;
  TotalImpuesto: number;
  TotalComprobante: number;
}

export interface Persona {
  Nombre: string;
  Identificacion: {
    Tipo?: string;
    Numero: string;
  };
  NombreComercial?: string;
  Ubicacion?: {
    Provincia?: string;
    Canton?: string;
    Distrito?: string;
    Barrio?: string;
    OtrasSenas?: string;
  };
  Telefono?: {
    CodigoPais?: string;
    NumTelefono?: string;
  };
  Fax?: {
    CodigoPais?: string;
    NumTelefono?: string;
  };
  CorreoElectronico?: string;
}

export interface Message {
  Mensaje: string;
  DetalleMensaje: string;
}

export interface FacturaElectronica {
  Clave: string;
  CodigoActividad: string;
  NumeroConsecutivo: string;
  FechaEmision?: Date;
  Emisor: Persona;
  Receptor: Persona;
  CondicionVenta?: string;
  PlazoCredito?: string;
  MedioPago?: string;
  DetalleServicio?: DetalleServicio;
  ResumenFactura: Resumen;
  Otros?: {
    OtroTexto: string;
  };
}

export interface FacturaElectronicaContenedor {
  FacturaElectronica: FacturaElectronica;
}
