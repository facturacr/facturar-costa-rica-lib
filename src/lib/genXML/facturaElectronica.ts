const XML_SCHEMA_NS = 'https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/facturaElectronica'
const XML_SCHEMA_XSI = 'https://www.hacienda.go.cr/ATV/ComprobanteElectronico/docs/esquemas/2016/v4.3/FacturaElectronica_V4.3.xsd'

export const XML_ATTRS = {
  '@_xmlns': XML_SCHEMA_NS,
  '@_xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
  '@_xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
  '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
  '@_xsi:schemaLocation': `${XML_SCHEMA_NS}${XML_SCHEMA_XSI}`
}

export const facturaElectronica = {
  Clave: '50620091900310207325600300001010000014090348891784',
  CodigoActividad: '505001',
  NumeroConsecutivo: '00300001010000014090',
  FechaEmision: '2019-09-20T08:25:20-06:00',
  Emisor: {},
  Receptor: {},
  CondicionVenta: '01',
  PlazoCredito: '00',
  MedioPago: '01',
  DetalleServicio: {},
  ResumenFactura: {},
  Otros: {
    OtroTexto: ''
  }
}

export const detalleServicio = {
  LineaDetalle: {
    NumeroLinea: '1',
    Cantidad: '23.734',
    UnidadMedida: 'L',
    Detalle: 'SUPER',
    PrecioUnitario: '632.00000',
    MontoTotal: '14999.99986',
    SubTotal: '14999.99986',
    BaseImponible: '14999.99986',
    MontoTotalLinea: '15000.00000'
  }
}

export const resumen = {
  CodigoTipoMoneda: {
    CodigoMoneda: 'CRC',
    TipoCambio: '1'
  },
  TotalServGravados: '0.00000',
  TotalServExentos: '0.00000',
  TotalMercanciasGravadas: '0.00000',
  TotalMercanciasExentas: '14999.99986',
  TotalGravado: '0.00000',
  TotalExento: '14999.99986',
  TotalVenta: '14999.99986',
  TotalDescuentos: '0.00000',
  TotalVentaNeta: '14999.99986',
  TotalImpuesto: '0.00000',
  TotalComprobante: '14999.99986'
}

export const contribuyente = {
  Nombre: 'Servicentro Naranjo Jorge Barrientos cia Ltda',
  Identificacion: {
    Tipo: '02',
    Numero: '3102073256'
  },
  NombreComercial: 'Servicentro Naranjo',
  Ubicacion: {
    Provincia: '2',
    Canton: '06',
    Distrito: '01',
    Barrio: '06',
    OtrasSenas: 'Dirección Alajuela, naranjo, naranjo centro.'
  },
  Telefono: {
    CodigoPais: '+506',
    NumTelefono: '24500180'
  },
  Fax: {
    CodigoPais: '+506',
    NumTelefono: '24500180'
  },
  CorreoElectronico: 'facturacionjb@cjbcr.com'
}
