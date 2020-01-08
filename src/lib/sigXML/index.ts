import pem from 'pem'
import NodeRSA from 'node-rsa'
import x509 from 'x509'

export const sigXML = (xml: string, p12Options: any): any => {
  const { buffer, password } = p12Options
  return new Promise((resolve, reject) => {
    pem.readPkcs12(buffer, {
      p12Password: password
    }, (error, keybundle) => {
      if (error) {
        return error
      }
      const key = new NodeRSA(keybundle.key)
      const modules = key.keyPair.n
      const exponent = key.keyPair.e
      const cert = x509.parseCert(keybundle.cert)
      resolve(keybundle)
    })
  })
}

// https://github.com/Dexus/pem/tree/6dd09b0e4c54082a099fa72f064dbb85b3d1249d
// https://github.com/digitalbazaar/forge/issues/338
// https://stackoverflow.com/questions/52009637/phps-openssl-sign-equivalent-in-node-js
// https://github.com/digitalbazaar/forge#x509
