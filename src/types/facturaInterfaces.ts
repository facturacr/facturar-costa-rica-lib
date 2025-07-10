/* references
  https://www.hacienda.go.cr/ATV/ComprobanteElectronico/frmAnexosyEstructuras.aspx#
  https://www.hacienda.go.cr/ATV/ComprobanteElectronico/docs/esquemas/2016/v4/ANEXOS%20Y%20ESTRUCTURAS.pdf
*/

export interface Impuesto {
  Codigo: string;
  Tarifa?: number;
  Monto?: number;
}

export interface LineaDetalle {
  NumeroLinea?: string;
  Codigo?: string; // CAByS - https://www.bccr.fi.cr/seccion-indicadores-economicos/cat%C3%A1logo-de-bienes-y-servicios
  Cantidad?: number;
  UnidadMedida?: string;
  Detalle: string;
  PrecioUnitario: number;
  MontoTotal?: number;
  SubTotal?: number;
  BaseImponible?: number;
  Impuesto?: Impuesto;
  ImpuestoAsumidoEmisorFabrica?: number;
  MontoTotalLinea?: number;
}

export interface DetalleServicio {
  LineaDetalle: Array<LineaDetalle>;
}

export interface TotalDesgloseImpuesto {
  Codigo: string;
  CodigoTarifaIVA: string;
  // ... other properties
  TotalMontoImpuesto: number;
}

export interface Resumen {
  CodigoTipoMoneda?: {
    CodigoMoneda: string;
    TipoCambio: string;
  };
  TotalServGravados: number;
  TotalServExentos: number;
  // TotalServExonerado: number;
  TotalMercanciasGravadas?: number;
  TotalMercanciasExentas?: number;
  TotalGravado?: number;
  TotalExento: number;
  TotalExonerado: number;
  TotalVenta: number;
  TotalDescuentos?: number;
  TotalVentaNeta?: number;
  TotalImpuesto: number;
  TotalDesgloseImpuesto?: TotalDesgloseImpuesto[];
  MedioPago?: {
    TipoMedioPago: string;
  };
  TotalComprobante: number;
}

export interface Persona {
  Nombre: string;
  Identificacion: {
    Tipo?: '01' | '02';
    Numero: string;
  };
  NombreComercial?: string;
  Ubicacion?: {
    Provincia?: '1' | '2' | '3' | '4' | '5' | '6' | '7';
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

export interface InformacionReferencia {
  TipoDoc: string;
  Numero: string;
  FechaEmision: string;
  Codigo: string;
  Razon: string;
}

export interface AtvDocument {
  Clave: string;
  ProveedorSistemas: string;
  CodigoActividadEmisor: string;
  CodigoActividadReceptor?: string; // TODO check supported docs
  NumeroConsecutivo: string;
  FechaEmision?: string;
  Emisor: Persona;
  Receptor?: Persona;
  CondicionVenta?: string;
  PlazoCredito?: string;
  DetalleServicio?: DetalleServicio;
  ResumenFactura: Resumen;
  Otros?: {
    OtroTexto: string;
  };
  InformacionReferencia?: InformacionReferencia;
}

export interface XMLRawDocument extends AtvDocument {

}

interface MensajeReceptor {
  Clave: string;
  NumeroCedulaEmisor: string;
  FechaEmisionDoc: string;
  Mensaje: string;
  DetalleMensaje: string;
  MontoTotalImpuesto: number;
  CodigoActividad: string;
  CondicionImpuesto: string;
  MontoTotalDeGastoAplicable: number;
  TotalFactura: number;
  NumeroCedulaReceptor: string;
  NumeroConsecutivoReceptor: string;
}

export interface InvoiceDocumentContainer {
  [key: string]: AtvDocument | MensajeReceptor;
}

export type ConfirmationMessageRaw = {
  MensajeHacienda: {
    Clave: string;
    NombreEmisor: string;
    TipoIdentificacionEmisor: string;
    NumeroCedulaEmisor: string;
    TipoIdentificacionReceptor: string;
    NumeroCedulaReceptor: string;
    Mensaje: string;
    DetalleMensaje: string;
    MontoTotalImpuesto: string;
    TotalFactura: string;
    '@_xmlns': string;
    'ds:Signature': {
      '@_xmlns:ds': string;
      '@_Id': string;
      'ds:SignedInfo': unknown;
      'ds:SignatureValue': unknown;
      'ds:KeyInfo': unknown;
      'ds:Object': unknown;
    };
  };
}
