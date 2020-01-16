import { j2xParser } from 'fast-xml-parser'
import { XML_ATTRS, declaration, defaultOptions } from './xmlConfig'

export default (obj: object): any => {
  const parser = new j2xParser(defaultOptions) // eslint-disable-line new-cap
  const mainKey = Object.keys(obj)[0]
  //obj[mainKey].attr = XML_ATTRS
  return declaration + parser.parse(obj)
}
