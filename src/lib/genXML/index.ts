import { FacturaElectronica } from '../facturaInterfaces'
import { j2xParser } from 'fast-xml-parser'

const defaultOptions = {}

export default (facturaElectronica: FacturaElectronica): any => {
  const parser = new j2xParser(defaultOptions) // eslint-disable-line new-cap
  return parser.parse(facturaElectronica)
}
