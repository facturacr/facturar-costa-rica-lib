import { j2xParser } from 'fast-xml-parser'
import pem from 'pem'
import NodeRSA from 'node-rsa'
import { XML_ATTRS, declaration, defaultOptions } from './xmlConfig'

export const genXML = (obj: object): string => {
  const parser = new j2xParser(defaultOptions) // eslint-disable-line new-cap
  const mainKey = Object.keys(obj)[0]
  obj[mainKey].attr = XML_ATTRS
  return declaration + parser.parse(obj)
}

export const sigXML = (xml: string, p12Options: any): any => {
  const { buffer, password } = p12Options
  pem.readPkcs12(buffer, {
    p12Password: password
  }, (error, keybundle) => {
    if (error) {
      return error
    }
    const key = new NodeRSA(keybundle.key)
    const modules = key.keyPair.n
    const exponent = key.keyPair.e
    console.log('modules', modules)
    console.log('exponent', exponent)
  })
}

export default (obj: object, p12Options?: any): string => {
  const xml = genXML(obj)
  if (p12Options) {
    return sigXML(xml, p12Options)
  }
  return xml
}

// https://github.com/Dexus/pem/tree/6dd09b0e4c54082a099fa72f064dbb85b3d1249d
// https://github.com/digitalbazaar/forge/issues/338
// https://stackoverflow.com/questions/52009637/phps-openssl-sign-equivalent-in-node-js
// https://github.com/digitalbazaar/forge#x509
