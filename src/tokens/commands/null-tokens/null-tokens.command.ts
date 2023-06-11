export class NullTokensCommand {
  constructor(public readonly refreshToken: string, public readonly csrfToken: string) {}
}
