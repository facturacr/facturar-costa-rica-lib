import fs from 'fs'
import genXML from '../src/lib/genXML'
const SOURCE_JSON_URI = process.env.SOURCE_JSON_URI
const jsonInput = fs.readFileSync(SOURCE_JSON_URI)
const parsedObject = JSON.parse(jsonInput.toString())

const XML = genXML(parsedObject)

console.log('XML', XML)
