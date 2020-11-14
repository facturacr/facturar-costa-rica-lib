import getToken from '../../src/services/getToken'

const USERNAME_TEST = process.env.USERNAME_TEST
const PASSWORD_TEST = process.env.PASSWORD_TEST

describe('GET TOKEN', () => {
  it('should create a new user token', async () => {
    const response = await getToken({
      client_id: 'api-stag',
      client_secret: '',
      grant_type: 'password',
      username: USERNAME_TEST,
      password: PASSWORD_TEST
    })
    const { access_token } = response.data
    expect(access_token).toBeTruthy()
  })
})