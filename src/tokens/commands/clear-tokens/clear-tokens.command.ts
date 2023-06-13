export class ClearTokensCommand {
  constructor(public readonly refreshToken: string, public readonly csrfToken: string) {}
}
