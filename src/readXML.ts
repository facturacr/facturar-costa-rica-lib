// test file

import fs from 'fs'
import * as parser from 'fast-xml-parser'
const sourceURI = 'src/lib/genXML/facturaElectronica.xml'
const xmlString = fs.readFileSync(sourceURI, 'utf8')

const options = {
  ignoreAttributes: false,
  ignoreNameSpace: false
}

const json = parser.parse(xmlString, options)
const Parser = parser.j2xParser

const convertToXML = new Parser(options)
const xml = convertToXML.parse(json)

console.log('json', json)
console.log('xml', xml)
