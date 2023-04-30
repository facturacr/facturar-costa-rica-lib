export type GetTokenDto = {
  username: string;
  password: string;
}

export type GetTokenInternalProps = {
  serviceUrl: string;
  clientId: string;
};

export type GetTokenRawResponse = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

export type GetTokenResponse = {
  accessToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  refreshToken: string;
  tokenType: string;
  sessionState: string;
  scope: string;
}
