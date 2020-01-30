import { j2xParser } from 'fast-xml-parser'
import { declaration, defaultOptions } from './xmlConfig'
import sigXML from './sigXML'

const encodeXML = (xmlStr: string): string => {
  const buffer = Buffer.from(xmlStr)
  return buffer.toString('base64')
}

export const genXML = (obj: object): string => {
  const parser = new j2xParser(defaultOptions) // eslint-disable-line new-cap
  const mainKey = Object.keys(obj)[0]
  // obj[mainKey].attr = XML_ATTRS
  return declaration + parser.parse(obj)
}

export default async (obj: object, options?: any): Promise<string> => {
  const xml = genXML(obj)
  if (!options) return xml
  const signedXML = await sigXML(xml, options.buffer, options.password)
  if (!options.base64) return signedXML
  return encodeXML(signedXML)
}
