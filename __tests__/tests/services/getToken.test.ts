import axios from 'axios'
import { tokenStub, postTokenOptions } from '@test/stubs/token.stub'
import getToken from '@src/services/getToken'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Get Token', () => {
  it('should return a valid token', async () => {
    mockedAxios.post.mockResolvedValue({ data: tokenStub })
    const token = await getToken(postTokenOptions)

    expect(token).toEqual({ data: tokenStub })
  })
})
