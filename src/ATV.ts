
import { GetToken } from './services/getToken/GetToken'
import { GetTokenDto, GetTokenResponse } from './services/getToken/types'

export type Mode = 'prod' | 'stg' | 'custom';

export type ATVOptions = {
  defaultOverwrites?: {
    tokenServiceUrl: string;
  };
}

export type TokenServiceProps = {
  serviceUrl: string;
  clientId: string;
}

export class ATV {
  public readonly options: ATVOptions
  constructor(options?: ATVOptions, public readonly mode: Mode = 'prod') {
    this.options = options
  }

  public getToken(params: GetTokenDto): Promise<GetTokenResponse> {
    const tokenService = new GetToken(this)
    return tokenService.execute(params)
  }
}
