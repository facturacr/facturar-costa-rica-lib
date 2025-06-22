export const ATV_VERSION = '4.4'

const BASE_DOMAIN = 'https://cdn.comprobanteselectronicos.go.cr/xml-schemas'

const buildNs = (type: string) =>
  `${BASE_DOMAIN}/v${ATV_VERSION}/${type}`

export const declaration = '<?xml version="1.0" encoding="utf-8"?>'

export const defaultOptions = {
  attrNodeName: 'attr'
}

const COMMON_STRUCTURE = {
  'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
  'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
  'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
}

function buildAttrs(type: string) {
  return Object.assign(
    { xmlns: buildNs(type) },
    COMMON_STRUCTURE
  )
}

export const xmlExtructures = {
  FacturaElectronica: buildAttrs('facturaElectronica'),
  TiqueteElectronico: buildAttrs('tiqueteElectronico'),
  FacturaElectronicaExportacion: buildAttrs('facturaElectronica'),
  NotaCreditoElectronica: buildAttrs('notaCreditoElectronica'),
  NotaDebitoElectronica: buildAttrs('notaCreditoElectronica'),
  MensajeReceptor: buildAttrs('mensajeReceptor'),
  CCE: buildAttrs('mensajeReceptor'),
  CPCE: buildAttrs('mensajeReceptor'),
  RCE: buildAttrs('mensajeReceptor')
}
