import { tokenStub } from '@test/stubs/token.stub'
import requestStub from '@test/stubs/frontendRequest.stub'
import eletronicBill from '@src/electronicBill'
import { send } from '@src/services/send/index'
import fs from 'fs'
import path from 'path'
const SOURCE_P12_URI = path.join(__dirname, '../stubs/dummyKeys/client-identity.p12')

jest.mock('@src/services/send/index')

const mockedSend = send as jest.MockedFunction<typeof send>
const pem = fs.readFileSync(SOURCE_P12_URI, 'binary')

describe('Get Token', () => {
  it('should return a valid token', async () => {
    mockedSend.mockImplementation(() => {
      return Promise.resolve('')
    })
    const bill = await eletronicBill(tokenStub, requestStub, {
      buffer: pem,
      password: '1234'
    })
  
    console.log('bill', bill);

    expect(bill).toEqual('')
  })
})