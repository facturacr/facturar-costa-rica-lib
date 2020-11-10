import { Application, SignedXml, Parse, OptionsXAdES } from 'xadesjs'
import { Crypto } from '@peculiar/webcrypto'
import { genKeysAndCert } from './genKeysAndCert'
import { XMLSerializer } from 'xmldom-alpha'

function addSigToXML(xml: Document, signature: any): string {
  xml.documentElement.appendChild(signature.GetXml())
  const oSerializer = new XMLSerializer()
  const sXML = oSerializer.serializeToString(xml)
  return sXML.toString()
}

const generateId = (crypto): string => {
  return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, (str: any) =>
    (str ^ (crypto.getRandomValues(new Uint8Array(1)))[0] & 15 >> str / 4).toString(16)
  )
}

function getOptions(publicKey: CryptoKey, x509: any, referenceId: string): OptionsXAdES {
  return { // options
    keyValue: publicKey,
    references: [
      {
        id: 'Reference-' + referenceId,
        uri: '',
        hash: 'SHA-256',
        transforms: [
          // 'c14n',
          'enveloped'
        ]
      }
    ],
    signerRole: {
      claimed: ['ObligadoTributario']
    },
    policy: {
      hash: 'SHA-1',
      identifier: {
        qualifier: 'OIDAsURI',
        value: 'https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/facturaElectronica'
      }
    },
    x509: [x509],
    signingCertificate: x509
  }
}

function getAlgorithm(): any {
  return {
    name: 'RSASSA-PKCS1-v1_5',
    hash: 'SHA-256',
    publicExponent: new Uint8Array([1, 0, 1]),
    modulusLength: 2048
  }
}

export default async function signXML(xmlStr: string, p12: string, p12Password: string): Promise<string> {
  if (!p12 || !p12Password) {
    console.log('p12 options undefined')
    return
  }
  const crypto = new Crypto()
  const referenceId = generateId(crypto)
  Application.setEngine('OpenSSL', crypto)
  const xadesXml = new SignedXml()
  const algorithm = getAlgorithm()
  const result = genKeysAndCert(crypto, {
    algorithm,
    keyStr: p12,
    password: p12Password
  })
  const x509 = result.cert.certPem
  const xml = Parse(xmlStr)
  const key = await result.privateKey
  const publicKey = await result.publicKey
  const signature = await xadesXml.Sign(
    algorithm,
    key,
    xml,
    getOptions(publicKey, x509, referenceId)
  )
  return addSigToXML(xml, signature)
}
