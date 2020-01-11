import * as XAdES from 'xadesjs'
import { Crypto } from '@peculiar/webcrypto'
import { getCryptoKey } from './getCryptoKey'
import { XMLSerializer } from 'xmldom-alpha'

function preparePem (pem: string): string {
  return pem
    .replace(/-----(BEGIN|END)[\w\d\s]+-----/g, '')
    .replace(/[\r\n]/g, '')
}

function addSigToXML (xml: Document, signature: any): string {
  xml.documentElement.appendChild(signature.GetXml())
  const oSerializer = new XMLSerializer()
  const sXML = oSerializer.serializeToString(xml)
  return sXML.toString()
}

function getOptions (certificate: string): any {
  const x509 = preparePem(certificate)
  return { // options
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
  }
}

export default async function signXML (xmlStr: string, p12: string, p12Password: string): Promise<string> {
  const crypto = new Crypto()
  XAdES.Application.setEngine('NodeJS', crypto)
  const xadesXml = new XAdES.SignedXml()
  const { cryptoKey, certificate } = getCryptoKey(crypto, p12, p12Password)
  const xml = XAdES.Parse(xmlStr)
  const alg = {
    name: 'RSASSA-PKCS1-v1_5',
    hash: 'SHA-256'
  }
  const signature = await xadesXml.Sign(
    alg,
    await cryptoKey,
    xml,
    getOptions(certificate)
  )
  return addSigToXML(xml, signature)
}
