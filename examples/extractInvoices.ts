import { ATV } from '@src/ATV'
import { GetDocumentsCommand } from '@src/ATV/useCases/getDocuments'

const IS_STG = process.env.IS_STG
const USERNAME_TEST = process.env.USERNAME_TEST
const PASSWORD_TEST = process.env.PASSWORD_TEST
console.log('process.env.IS_STG', IS_STG)

async function main(): Promise<void> {
  const atv = new ATV({})
  const tokenData = await atv.getToken({
    username: USERNAME_TEST,
    password: PASSWORD_TEST
  })
  console.log('tokenData', tokenData)
  const command = new GetDocumentsCommand(atv, tokenData.accessToken).command
  // const response = await atv.send(command)
  // console.log('response', response)
}

main()
