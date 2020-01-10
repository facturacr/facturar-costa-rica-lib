import fs from 'fs'
import genXML from '../src/lib/genXML'

const SOURCE_JSON_URI = process.env.SOURCE_JSON_URI
const SOURCE_P12_URI = process.env.SOURCE_P12_URI
const SOURCE_P12_PASSPORT = process.env.SOURCE_P12_PASSPORT

const jsonInput = fs.readFileSync(SOURCE_JSON_URI)
const pem = fs.readFileSync(SOURCE_P12_URI, 'binary')
const parsedObject = JSON.parse(jsonInput.toString())

async function main() {
  const XML = await genXML(parsedObject, {
    buffer: pem,
    password: SOURCE_P12_PASSPORT
  })
  console.log('XML', XML)
  fs.writeFile('tmp.xml', XML, (err) => {
    console.log(err)
  })
}

main()
