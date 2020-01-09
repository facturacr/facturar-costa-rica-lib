import fs from 'fs'
import { getCryptoKey } from '../src/lib/sigXML/getCryptoKey'
import { Crypto } from '@peculiar/webcrypto'

const SOURCE_P12_URI = process.env.SOURCE_P12_URI
const SOURCE_P12_PASSPORT = process.env.SOURCE_P12_PASSPORT

async function main () {
  const crypto = new Crypto()
  const pem = fs.readFileSync(SOURCE_P12_URI, 'binary')
  const { cryptoKey, certificate } = getCryptoKey(crypto, pem, SOURCE_P12_PASSPORT)
  console.log('cryptoKey', await cryptoKey)
}

main()
