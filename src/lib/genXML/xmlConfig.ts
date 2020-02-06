const FE_XML_SCHEMA_NS = 'https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/facturaElectronica'
const FE_XML_SCHEMA_XSI = 'https://www.hacienda.go.cr/ATV/ComprobanteElectronico/docs/esquemas/2016/v4.3/FacturaElectronica_V4.3.xsd'
const MR_XML_SCHEMA_NS = 'https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/mensajeReceptor'

export const declaration = '<?xml version="1.0" encoding="utf-8"?>'

export const defaultOptions = {
  attrNodeName: 'attr'
}

export const FE_XML_ATTRS = { // Factura Electronica
  xmlns: FE_XML_SCHEMA_NS,
  'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
  'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
  'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
  'xsi:schemaLocation': `${FE_XML_SCHEMA_NS} ${FE_XML_SCHEMA_XSI}`
}

export const MR_XML_ATTRS = { // Mensaje Receptor
  xmlns: FE_XML_SCHEMA_NS,
  'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
  'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
  'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
  'xsi:schemaLocation': `${MR_XML_SCHEMA_NS}`
}
