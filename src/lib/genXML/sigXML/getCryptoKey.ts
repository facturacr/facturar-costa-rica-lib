import forge from 'node-forge'

function stringToArrayBuffer(data): any {
  const arrBuff = new ArrayBuffer(data.length)
  const writer = new Uint8Array(arrBuff)
  for (let i = 0, len = data.length; i < len; i++) {
    writer[i] = data.charCodeAt(i)
  }
  return arrBuff
}

function getCertificate(certificateArr): any {
  const cert = certificateArr[0]
  const certPem = forge.pki.certificateToPem(cert.cert)
  const certDer = forge.pki.pemToDer(certPem)
  return forge.util.encode64(certDer.data)
}

function getCertAndPrivateKey(pkcs12): any {
  const certificateArr = []
  let privateKey
  for (let sci = 0; sci < pkcs12.safeContents.length; ++sci) {
    const safeContents = pkcs12.safeContents[sci]
    for (let sbi = 0; sbi < safeContents.safeBags.length; ++sbi) {
      const safeBag = safeContents.safeBags[sbi]
      // this bag has a private key
      if (safeBag.type === forge.pki.oids.keyBag) {
        // Found plain private key
        privateKey = safeBag.key
      } else if (safeBag.type === forge.pki.oids.pkcs8ShroudedKeyBag) {
        // found encrypted private key
        privateKey = safeBag.key
      } else if (safeBag.type === forge.pki.oids.certBag) {
        // this bag has a certificate...
        certificateArr.push(safeBag)
      }
    }
  }
  const certificate = getCertificate(certificateArr)
  return { privateKey, certificate }
}

function _privateKeyToPkcs8(privateKey): any {
  const rsaPrivateKey = forge.pki.privateKeyToAsn1(privateKey)
  const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey)
  const privateKeyInfoDer = forge.asn1.toDer(privateKeyInfo).getBytes()
  const privateKeyInfoDerBuff = stringToArrayBuffer(privateKeyInfoDer)
  return privateKeyInfoDerBuff
}

export function getCryptoKey(
  crypto: Crypto,
  contents: Buffer|string,
  password: string):
  any {
  const pkcs12Asn1 = forge.asn1.fromDer(contents, false)
  const pkcs12 = forge.pkcs12.pkcs12FromAsn1(pkcs12Asn1, password)
  const { privateKey, certificate } = getCertAndPrivateKey(pkcs12)
  const privateKeyInfoDerBuff = _privateKeyToPkcs8(privateKey)
  const cryptoKey = crypto.subtle.importKey(
    'pkcs8',
    privateKeyInfoDerBuff,
    { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
    false,
    ['sign'])
  return { cryptoKey, certificate }
}
