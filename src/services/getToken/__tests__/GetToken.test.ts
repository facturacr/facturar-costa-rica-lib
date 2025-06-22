import axios from 'axios'
import qs from 'querystring'
import { GetToken } from '../GetToken'
import { ATV } from '@src/ATV'
import { GetTokenDto } from '../types'

jest.mock('@src/ATV')
jest.mock('axios')
jest.mock('querystring')

const fetchResponse = {
  data: {
    access_token: 'access_token',
    expires_in: 3600,
    refresh_token: 'refresh_token',
    refresh_expires_in: 1209600,
    session_state: 'session_state',
    token_type: 'Bearer',
    scope: 'openid'
  }
}
describe('GetToken', () => {
  let atv: ATV
  let getToken: GetToken

  beforeEach(() => {
    atv = new ATV()
    getToken = new GetToken(atv)
    ;(axios.post as jest.Mock).mockResolvedValue(fetchResponse)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should call axios.post with correct parameters', async () => {
    // Arrange
    const dto: GetTokenDto = {
      username: 'testuser',
      password: 'testpassword'
    }
    const expectedUrl = 'https://idp.comprobanteselectronicos.go.cr/auth/realms/rut/protocol/openid-connect/token'
    const expectedData = qs.stringify({
      client_id: 'api-stag',
      grant_type: 'password',
      client_secret: '',
      username: 'testuser',
      password: 'testpassword'
    })
    const expectedConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    // Act
    await getToken.execute(dto)

    // Assert
    expect(axios.post).toHaveBeenCalledWith(expectedUrl, expectedData, expectedConfig)
  })

  it('should return expected response', async () => {
    // Arrange
    const expectedResponse = {
      accessToken: 'access_token',
      expiresIn: 3600,
      refreshToken: 'refresh_token',
      refreshExpiresIn: 1209600,
      sessionState: 'session_state',
      tokenType: 'Bearer',
      scope: 'openid'
    }

    // Act
    const result = await getToken.execute({ username: 'testuser', password: 'testpassword' })

    // Assert
    expect(result).toEqual(expectedResponse)
  })
})
