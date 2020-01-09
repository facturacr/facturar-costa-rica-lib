import fs from 'fs'
import { Crypto } from '@peculiar/webcrypto'
import * as XAdES from 'xadesjs'
import { XMLSerializer } from 'xmldom-alpha'
import { getCryptoKey } from '../src/lib/sigXML/getCryptoKey'

const crypto = new Crypto()
XAdES.Application.setEngine('NodeJS', crypto)

function preparePem (pem) {
  return pem
  // remove BEGIN/END
    .replace(/-----(BEGIN|END)[\w\d\s]+-----/g, '')
  // remove \r, \n
    .replace(/[\r\n]/g, '')
}

function pem2der (pem) {
  pem = preparePem(pem)
  // convert base64 to ArrayBuffer
  return new Uint8Array(Buffer.from(pem, 'base64')).buffer
}

async function main () {
  const alg = {
    name: 'RSASSA-PKCS1-v1_5',
    hash: 'SHA-256'
  }
  const SOURCE_P12_URI = process.env.SOURCE_P12_URI
  const p12 = fs.readFileSync(SOURCE_P12_URI, 'binary')
  const SOURCE_P12_PASSPORT = process.env.SOURCE_P12_PASSPORT
  const { cryptoKey, certificate } = getCryptoKey(crypto, p12, SOURCE_P12_PASSPORT)
  // XAdES-EPES
  const xmlString = '<Test><Document attr="Hello"/></Test>'
  const xml = XAdES.Parse(xmlString)

  const xadesXml = new XAdES.SignedXml()
  // console.log('cert', certificate)
  const x509 = preparePem(certificate)
  const signature = await xadesXml.Sign( // Signing document
    alg, // algorithm
    await cryptoKey, // key
    xml, // document
    { // options
      references: [
        { hash: 'SHA-256', transforms: ['c14n', 'enveloped'] }
      ],
      policy: {
        hash: 'SHA-256',
        identifier: {
          qualifier: 'OIDAsURI',
          value: 'https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/facturaElectronica'
        }
      },
      signingCertificate: x509
    })

  // append signature
  xml.documentElement.appendChild(signature.GetXml())

  // serialize XML
  const oSerializer = new XMLSerializer()
  const sXML = oSerializer.serializeToString(xml)
  console.log(sXML.toString())
}

main()
  .catch((err) => {
    console.error(err)
  })

// https://stackoverflow.com/a/37407739/2272082
