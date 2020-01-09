const XML_SCHEMA_NS = 'https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/facturaElectronica'
const XML_SCHEMA_XSI = 'https://www.hacienda.go.cr/ATV/ComprobanteElectronico/docs/esquemas/2016/v4.3/FacturaElectronica_V4.3.xsd'

export const declaration = '<?xml version="1.0" encoding="utf-8"?>'

export const defaultOptions = {
  attrNodeName: 'attr'
}

export const XML_ATTRS = {
  xmlns: XML_SCHEMA_NS,
  'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
  'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
  'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
  'xsi:schemaLocation': `${XML_SCHEMA_NS}${XML_SCHEMA_XSI}`
}
