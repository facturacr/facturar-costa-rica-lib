import { ATV } from '@src/ATV'

const IS_STG = process.env.IS_STG
const USERNAME_TEST = process.env.USERNAME_TEST
const PASSWORD_TEST = process.env.PASSWORD_TEST
console.log('process.env.IS_STG', IS_STG)
console.log('password', PASSWORD_TEST)
const mode = IS_STG ? 'stg' : undefined
const atv = new ATV({}, mode)
const tokenData = atv.getToken({
  // @ts-expect-error migration - for example purposes
  username: USERNAME_TEST,
  // @ts-expect-error migration - for example purposes
  password: PASSWORD_TEST
})
tokenData.then((resp) => {
  console.log('accessToken', resp.accessToken)
})
