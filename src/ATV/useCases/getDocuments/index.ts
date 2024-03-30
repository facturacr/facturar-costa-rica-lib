import { ATV } from '@src/ATV'

export class GetDocumentsCommand {
  private readonly serviceUrl: string;

  public command;

  constructor(scope: ATV, token?: string) {
    this.serviceUrl = scope.options.urls.createDocumentUrl
    this.createCommand(token)
  }

  public createCommand(token: string) {
    this.command = {
      url: this.serviceUrl,
      method: 'POST',
      headers: {
        Authorization: 'bearer ' + token,
        'Content-Type': 'application/json'
      }
    }
    return this.command
  }
}
