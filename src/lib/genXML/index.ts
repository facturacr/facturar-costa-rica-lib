import { j2xParser, parse } from 'fast-xml-parser'
import { declaration, defaultOptions, FE_XML_ATTRS } from './xmlConfig'
import sigXML from './sigXML/index'

const encodeXML = (xmlStr: string): string => {
  const buffer = Buffer.from(xmlStr)
  return buffer.toString('base64')
}

export const objToXML = (obj: object): string => {
  const parser = new j2xParser(defaultOptions) // eslint-disable-line new-cap
  const mainKey = Object.keys(obj)[0]
  obj[mainKey].attr = FE_XML_ATTRS
  return declaration + parser.parse(obj)
}

export async function genXML(obj: object, options?: {
    buffer?: string;
    password?: string;
    base64?: boolean;
  }): Promise<string> {
  const xml = objToXML(obj)
  if (!options) return xml
  const signedXML = await sigXML(xml, options.buffer, options.password)
  if (!options.base64) return signedXML
  return encodeXML(signedXML)
}

export const xmlToJson = (xml: string): any => {
  try {
    const json = parse(xml, {
      ignoreAttributes: false,
      ignoreNameSpace: false,
      parseNodeValue: false
    })
    return json.FacturaElectronica
  } catch (err) {
    return null
  }
}
