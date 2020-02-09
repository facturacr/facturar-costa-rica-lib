import fs from 'fs'
import genJSON from '../src/lib/genJSON'
import { parseOptions, genClaveObj, genString } from '../src/lib/genClave'
import fe from './input/frontendRequest'
import { FrontEndRequest } from '../src/types/globalInterfaces'

const frontEndRequest: FrontEndRequest = fe

const SOURCE_P12_URI = process.env.SOURCE_P12_URI
const SOURCE_P12_PASSPORT = process.env.SOURCE_P12_PASSPORT
const pem = fs.readFileSync(SOURCE_P12_URI, 'binary')
const outputSourceURI = process.env.SOURCE_URI_XML_OUTPUT

async function main(): Promise<void> {
  const parsedOpts = parseOptions(frontEndRequest)
  const claveObj = genClaveObj(parsedOpts)
  const claveStr = genString(claveObj)
  const consecutivo = Object.values(claveObj.consecutivo).join('')
  const date = new Date()
  const XML = await genJSON(frontEndRequest, date.toISOString(), claveStr, consecutivo, {
    buffer: pem,
    password: SOURCE_P12_PASSPORT,
    base64: false
  })
  const data = XML
  fs.writeFile(outputSourceURI, data, (err) => {
    if (err) throw err
  })
}

main()
