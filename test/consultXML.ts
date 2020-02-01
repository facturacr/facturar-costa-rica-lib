import { sendToCustomURL } from '../src/services/send'
import getToken from '../src/services/getToken'

const USERNAME_TEST = process.env.USERNAME_TEST
const PASSWORD_TEST = process.env.PASSWORD_TEST
const location = process.env.CLAVE_TEST

async function main(): Promise<any> {
  const token = await getToken({
    client_id: 'api-stag', // eslint-disable-line
    client_secret: '', // eslint-disable-line
    grant_type: 'password', // eslint-disable-line
    username: USERNAME_TEST,
    password: PASSWORD_TEST
  })
  const secondResponse = await sendToCustomURL(token, location).catch((err) => {
    const response = err.response || {}
    const header = response.headers || {}
    const data = response.data = {}
    console.log('status', response.status)
    console.log('data', data)
    console.log('x-error-cause', header['x-error-cause'])
    console.log('err', err)
  })
  if (secondResponse) {
    console.log('secondResponse', secondResponse.data)
  }
}

main()
