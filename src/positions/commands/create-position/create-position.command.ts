export class CreatePositionCommand {
  constructor(public readonly companyId: string, public readonly value: string) {}
}
