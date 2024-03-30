const FE_XML_SCHEMA_NS = 'https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/facturaElectronica'
const FE_XML_SCHEMA_XSI = 'https://www.hacienda.go.cr/ATV/ComprobanteElectronico/docs/esquemas/2016/v4.3/FacturaElectronica_V4.3.xsd'

const FEE_XML_SCHEMA_NS = 'https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/facturaElectronicaExportacion'
const FEE_XML_SCHEMA_XSI = 'https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/facturaElectronicaExportacion.xsd'

const MR_XML_SCHEMA_NS = 'https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/mensajeReceptor'

const NC_XML_SCHEMA_NS = 'https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/notaCreditoElectronica'
const NC_XML_SCHEMA_XSI = 'https://www.hacienda.go.cr/ATV/ComprobanteElectronico/docs/esquemas/2016/v4.3/NotaCreditoElectronica_V4.3.xsd'

const ND_XML_SCHEMA_NS = 'https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/notaDebitoElectronica'
const ND_XML_SCHEMA_XSI = 'https://www.hacienda.go.cr/ATV/ComprobanteElectronico/docs/esquemas/2016/v4.3/NotaDebitoElectronica_V4.3.xsd'

export const declaration = '<?xml version="1.0" encoding="utf-8"?>'

export const defaultOptions = {
  attrNodeName: 'attr'
}

const COMMON_STRUCTURE = {
  'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
  'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
  'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
}

const FE_XML_ATTRS = { // Factura Electronica
  xmlns: FE_XML_SCHEMA_NS,
  ...COMMON_STRUCTURE,
  'xsi:schemaLocation': `${FE_XML_SCHEMA_NS} ${FE_XML_SCHEMA_XSI}`
}

const FEE_XML_ATTRS = { // Factura Electronica Exportación
  xmlns: FE_XML_SCHEMA_NS,
  ...COMMON_STRUCTURE,
  'xsi:schemaLocation': `${FEE_XML_SCHEMA_NS} ${FEE_XML_SCHEMA_XSI}`
}

const NC_XML_ATTRS = { // Nota Credito Electronica
  xmlns: NC_XML_SCHEMA_NS,
  ...COMMON_STRUCTURE,
  'xsi:schemaLocation': `${NC_XML_SCHEMA_NS} ${NC_XML_SCHEMA_XSI}`
}

const ND_XML_ATTRS = { // Nota Credito Electronica
  xmlns: NC_XML_SCHEMA_NS,
  ...COMMON_STRUCTURE,
  'xsi:schemaLocation': `${ND_XML_SCHEMA_NS} ${ND_XML_SCHEMA_XSI}`
}

const MR_XML_ATTRS = { // Mensaje Receptor
  xmlns: MR_XML_SCHEMA_NS,
  ...COMMON_STRUCTURE,
  'xsi:schemaLocation': `${MR_XML_SCHEMA_NS}`
}

export const xmlExtructures = {
  FacturaElectronica: FE_XML_ATTRS,
  FacturaElectronicaExportacion: FEE_XML_ATTRS,
  NotaCreditoElectronica: NC_XML_ATTRS,
  NotaDebitoElectronica: ND_XML_ATTRS,
  CCE: MR_XML_ATTRS,
  CPCE: MR_XML_ATTRS,
  RCE: MR_XML_ATTRS
}
