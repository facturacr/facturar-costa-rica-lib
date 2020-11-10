import { j2xParser, parse } from 'fast-xml-parser'
import { declaration, defaultOptions, xmlExtructures } from './xmlConfig'
import sigXML from './sigXML/index'

const encodeXML = (xmlStr: string): string => {
  const buffer = Buffer.from(xmlStr)
  return buffer.toString('base64')
}

export const objToXML = (xmlStructure: string, obj: object): string => {
  const parser = new j2xParser(defaultOptions) // eslint-disable-line new-cap
  const mainKey = Object.keys(obj)[0]
  obj[mainKey].attr = xmlExtructures[xmlStructure]
  return declaration + parser.parse(obj)
}

// tipoDocKey = xmlStructure
export async function genXML(xmlStructure: string, obj: object, options?: {
    buffer?: string;
    password?: string;
    base64?: boolean;
  }): Promise<string> {
  const xml = objToXML(xmlStructure, obj)
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
