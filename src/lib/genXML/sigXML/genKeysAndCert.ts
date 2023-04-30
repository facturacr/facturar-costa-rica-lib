import forge from 'node-forge'

function getBags(pkcs12): any {
  const keyData = pkcs12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[forge.pki.oids.pkcs8ShroudedKeyBag].concat(pkcs12.getBags({ bagType: forge.pki.oids.keyBag })[forge.pki.oids.keyBag])
  const certBags = pkcs12.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag]
  return { keyData, certBags }
}

function preparePem(pem: string): string {
  return pem
    .replace(/-----(BEGIN|END)[\w\d\s]+-----/g, '')
    .replace(/[\r\n]/g, '')
}

function preparePems(privatePem, publicPem, certPem): any {
  const privatePem64 = preparePem(privatePem)
  const publicPem64 = preparePem(publicPem)
  const certPem64 = preparePem(certPem)
  return { privatePem64, publicPem64, certPem64 }
}

function fromBase64(base64Text: string): any {
  base64Text = base64Text.replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, '').replace(/\s/g, '')
  return new Uint8Array(Buffer.from(base64Text, 'base64')).buffer
}

function convertFromBase64(pems): any {
  const { privatePem64, publicPem64, certPem64 } = pems
  const privateKeyDer = fromBase64(privatePem64)
  const publicKeyDer = fromBase64(publicPem64)
  const certDer = fromBase64(certPem64)
  return { privateKeyDer, publicKeyDer, certDer }
}

function getPrivatePem(keyData): string {
  const rsaPrivateKey = forge.pki.privateKeyToAsn1(keyData[0].key)
  const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey)
  return forge.pki.privateKeyInfoToPem(privateKeyInfo)
}

function getPublicPem(privatePem): string {
  const preprivateKey = forge.pki.privateKeyFromPem(privatePem)
  const prepublicKey = forge.pki.setRsaPublicKey(preprivateKey.n, preprivateKey.e)
  return forge.pki.publicKeyToPem(prepublicKey)
}

function getKeysAndCert(keyStr, password): any {
  const pkcs12Asn1 = forge.asn1.fromDer(keyStr, false)
  const pkcs12 = forge.pkcs12.pkcs12FromAsn1(pkcs12Asn1, password)
  const { keyData, certBags } = getBags(pkcs12)
  const privatePem = getPrivatePem(keyData)
  const publicPem = getPublicPem(privatePem)
  const certPem = forge.pki.certificateToPem(certBags[0].cert)
  const pems64 = preparePems(privatePem, publicPem, certPem)
  return pems64
}

export function genKeysAndCert(crypto: Crypto, opts: {
    algorithm: any;
    keyStr: Buffer|string;
    password: string;
  }): any {
  const alg = opts.algorithm
  const pems = getKeysAndCert(opts.keyStr, opts.password)
  const ders = convertFromBase64(pems)
  const { privateKeyDer, publicKeyDer, certDer } = ders
  const pKey = crypto.subtle.importKey('pkcs8', privateKeyDer, alg, false, ['sign'])
  const pbKey = crypto.subtle.importKey('spki', publicKeyDer, alg, true, ['verify'])
  return {
    privateKey: pKey,
    publicKey: pbKey,
    cert: {
      certDer,
      certPem: pems.certPem64
    }
  }
}
