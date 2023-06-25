export class SaveFileCommand {
  constructor(
    public readonly path: string,
    public readonly fileName: string,
    public readonly file: Express.Multer.File,
  ) {}
}
