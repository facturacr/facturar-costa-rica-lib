import fs from 'fs'
import { Crypto } from '@peculiar/webcrypto'
import * as XAdES from 'xadesjs'
import { XMLSerializer } from 'xmldom-alpha'
import { sigXML } from '../src/lib/sigXML'

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
  const hash = 'SHA-256'
  const alg = {
    name: 'RSASSA-PKCS1-v1_5',
    hash: 'SHA-256'
  }
  const SOURCE_P12_URI = process.env.SOURCE_P12_URI
  const pem = fs.readFileSync(SOURCE_P12_URI)
  const SOURCE_P12_PASSPORT = process.env.SOURCE_P12_PASSPORT
  const x = await sigXML('', {
    buffer: pem,
    password: SOURCE_P12_PASSPORT
  })
  console.log(x.toString())
  const keyDer = pem2der(x.key)
  // const cryptoKey = await crypto.subtle.generateKey({
  //   name: 'RSASSA-PKCS1-v1_5',
  //   modulusLength: 1024, // can be 1024, 2048, or 4096,
  //   publicExponent: new Uint8Array([1, 0, 1]),
  //   hash: { name: 'SHA-256' } // can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
  // },
  // false,
  // ['sign', 'verify'])
  console.log('keyDer', x.key)
  const cryptoKey = await crypto.subtle.importKey('pkcs8', keyDer, alg, false, ['sing'])
  console.log('cryptoKey', cryptoKey)
  // XAdES-EPES
  const xmlString = '<Test><Document attr="Hello"/></Test>'
  const xml = XAdES.Parse(xmlString)

  const xadesXml = new XAdES.SignedXml()
  const x509 = preparePem(x.cert)
  const signature = await xadesXml.Sign( // Signing document
    alg, // algorithm
    cryptoKey, // key
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
