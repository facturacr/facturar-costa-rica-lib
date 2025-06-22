import { sendToCustomURL } from '@src/services/send'
import getToken from '@src/services/getToken'

const USERNAME_TEST = process.env.USERNAME_TEST
const PASSWORD_TEST = process.env.PASSWORD_TEST
const location = process.env.CLAVE_TEST

function decodeBase64(encodedStr: string): string {
  const buff = Buffer.from(encodedStr, 'base64')
  return buff.toString('ascii')
}

async function main(): Promise<any> {
  const token = await getToken({
    client_id: 'api-stag', // eslint-disable-line
    client_secret: '', // eslint-disable-line
    grant_type: 'password', // eslint-disable-line
    username: USERNAME_TEST,
    password: PASSWORD_TEST
  })
  // @ts-expect-error migration - for example purposes
  const secondResponse = await sendToCustomURL(token.data.access_token, location).catch((err) => {
    const response = err.response || {}
    const header = response.headers || {}
    const data = response.data = {}
    console.log('status', response.status)
    console.log('data', data)
    console.log('x-error-cause', header['x-error-cause'])
    console.log('err', err)
  })
  if (secondResponse) {
    const XMLResponse = secondResponse.data['respuesta-xml']
    const state = secondResponse.data['ind-estado']
    if (!XMLResponse) {
      console.log('state', state)
      return
    }
    const text = decodeBase64(XMLResponse)
    console.log('secondResponse', text)
  }
}

main()
