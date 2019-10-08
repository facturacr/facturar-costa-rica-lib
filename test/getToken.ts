import getToken from '../src/services/getToken'

const IS_STG = process.env.IS_STG
const USERNAME_TEST = process.env.USERNAME_TEST
const PASSWORD_TEST = process.env.PASSWORD_TEST
console.log('process.env.IS_STG', IS_STG)

getToken({
  client_id: 'api-stag', // eslint-disable-line camelcase
  client_secret: '', // eslint-disable-line camelcase
  grant_type: 'password', // eslint-disable-line camelcase
  username: USERNAME_TEST,
  password: PASSWORD_TEST
}).then((result) => {
  console.log('res', result.data)
}).catch((e) => {
  console.log('e', e.response.data)
})
