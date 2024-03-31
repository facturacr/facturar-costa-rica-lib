import axios from 'axios'
import qs from 'querystring'
import { GetTokenDto, GetTokenInternalProps, GetTokenRawResponse, GetTokenResponse } from './types'
import { ATV } from '@src/ATV'

const MAIN_DOMAIN = 'https://idp.comprobanteselectronicos.go.cr'
const options: { [key: string]: GetTokenInternalProps} = {
  prod: {
    serviceUrl: `${MAIN_DOMAIN}/auth/realms/rut/protocol/openid-connect/token`,
    clientId: 'api-prod'
  },
  stg: {
    serviceUrl: `${MAIN_DOMAIN}/auth/realms/rut-stag/protocol/openid-connect/token`,
    clientId: 'api-stag'
  }
}

export class GetToken {
  private readonly props: GetTokenInternalProps
  constructor(scope: ATV) {
    this.props = this.initProps(scope.mode)
  }

  public async execute({ username, password }: GetTokenDto): Promise<GetTokenResponse> {
    const fetchResponse = await axios.post<GetTokenRawResponse>(this.props.serviceUrl, qs.stringify({
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_id: this.props.clientId,
      // eslint-disable-next-line @typescript-eslint/camelcase
      grant_type: 'password',
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_secret: '',
      username,
      password
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    const data = fetchResponse.data
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      refreshToken: data.refresh_token,
      refreshExpiresIn: data.refresh_expires_in,
      sessionState: data.session_state,
      tokenType: data.token_type,
      scope: data.scope
    }
  }

  private initProps(mode: string): GetTokenInternalProps {
    return options[mode] || options.prod
  }
}
