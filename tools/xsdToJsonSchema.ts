/* ======================================= */
/* ============== WIP ==================== */
/* ======================================= */
/* Util to import ATV xsd and get some info like enums */
import fs from 'fs'
import * as Parser from 'fast-xml-parser'

const options = {
  ignoreAttributes: false,
  ignoreNameSpace: true,
  parseNodeValue: false,
  attrNodeName: 'attributes',
  attributeNamePrefix: ''
}
const sourceURI = process.env.XSD_SOURCE
const xmlString = fs.readFileSync(sourceURI, 'utf8')

const json = Parser.parse(xmlString, options)
const originalShema = json?.schema
const parentElement = originalShema?.element

const complexElements = originalShema?.complexType
const singleElements = originalShema?.simpleType

function processEnumerations(array: Array<any>): any {
  return array.map((enumeration) => {
    return enumeration?.attributes?.value
  })
}

function processLoop(array: Array<any>): any {
  const newObj = {}
  for (let i = 0; i < array.length; i++) {
    const element = array[i]
    const propKey = element?.attributes?.name
    if (propKey) {
      newObj[propKey] = {
        description: element?.annotation?.documentation
      }
    }
  }
  return newObj
}

function processObject(object: any): any {
  const props = processLoop(object?.complexType?.sequence?.element)
  const newObject = {}
  newObject[object?.attributes?.name] = {
    type: 'object',
    properties: props
  }
  return newObject
}

function processSimpleType(object: any): any {
  const newObject = {}
  const enumeration = object.restriction?.enumeration || []
  const enumationList = processEnumerations(enumeration)
  newObject[object?.attributes?.name] = {
    type: object.restriction?.attributes?.base,
    enum: enumationList,
    pattern: object.restriction?.pattern
  }
  return newObject
}

function processElementsFromComplexType(array: Array<any>): any {
  const newObj = {}
  for (let i = 0; i < array.length; i++) {
    const element = array[i]
    const propKey = element?.attributes?.name
    const simpleType = element?.simpleType ? processSimpleType(element?.simpleType) : {}
    if (propKey) {
      newObj[propKey] = {
        description: element?.annotation?.documentation,
        simpleType: simpleType
      }
    }
  }
  return newObj
}

function processComplexType(object: any): any {
  const elements = processElementsFromComplexType(object?.sequence?.element)
  const newObject = {}
  newObject[object?.attributes?.name] = {
    elements: elements
  }
  return newObject
}

const schema: Record<string, any> = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://facere.cr/schema.json',
  title: 'undefined',
  description: 'undefined',
  type: 'object',
  properties: {}
}

schema.properties = processObject(parentElement)
schema.singleElements = singleElements.map(processSimpleType)
schema.complexElements = complexElements.map(processComplexType)

const data = JSON.stringify(schema, null, 2)
fs.writeFile('./out.json', data, (err) => {
  if (err) throw err
})
