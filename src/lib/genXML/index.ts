import { j2xParser } from 'fast-xml-parser'
import { XML_ATTRS, declaration, defaultOptions } from './xmlConfig'
import sigXML from '../sigXML'

export const genXML = (obj: object): string => {
  const parser = new j2xParser(defaultOptions) // eslint-disable-line new-cap
  const mainKey = Object.keys(obj)[0]
  obj[mainKey].attr = XML_ATTRS
  return declaration + parser.parse(obj)
}

export default async (obj: object, p12Options?: any): Promise<string> => {
  const xml = genXML(obj)
  if (p12Options) {
    return sigXML(xml, p12Options.buffer, p12Options.password)
  }
  return xml
}
