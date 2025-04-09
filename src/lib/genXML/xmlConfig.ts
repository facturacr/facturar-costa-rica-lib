export const ATV_VERSION = '4.4'

const FE_XML_SCHEMA_NS = `https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v${ATV_VERSION}/facturaElectronica`

const MR_XML_SCHEMA_NS = `https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v${ATV_VERSION}/mensajeReceptor`

const NC_XML_SCHEMA_NS = `https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v${ATV_VERSION}/notaCreditoElectronica`

export const declaration = '<?xml version="1.0" encoding="utf-8"?>'

export const defaultOptions = {
  attrNodeName: "attr",
};

const COMMON_STRUCTURE = {
  "xmlns:ds": "http://www.w3.org/2000/09/xmldsig#",
  "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
  "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
};

const FE_XML_ATTRS = {
  // Factura Electronica
  xmlns: FE_XML_SCHEMA_NS,
  ...COMMON_STRUCTURE,
};

const FEE_XML_ATTRS = {
  // Factura Electronica Exportación
  xmlns: FE_XML_SCHEMA_NS,
  ...COMMON_STRUCTURE,
};

const NC_XML_ATTRS = {
  // Nota Credito Electronica
  xmlns: NC_XML_SCHEMA_NS,
  ...COMMON_STRUCTURE,
};

const ND_XML_ATTRS = {
  // Nota Credito Electronica
  xmlns: NC_XML_SCHEMA_NS,
  ...COMMON_STRUCTURE,
};

const MR_XML_ATTRS = {
  // Mensaje Receptor
  xmlns: MR_XML_SCHEMA_NS,
  ...COMMON_STRUCTURE,
};

export const xmlExtructures = {
  FacturaElectronica: FE_XML_ATTRS,
  FacturaElectronicaExportacion: FEE_XML_ATTRS,
  NotaCreditoElectronica: NC_XML_ATTRS,
  NotaDebitoElectronica: ND_XML_ATTRS,
  MensajeReceptor: MR_XML_ATTRS,
  CCE: MR_XML_ATTRS,
  CPCE: MR_XML_ATTRS,
  RCE: MR_XML_ATTRS,
};
