import { ensureDir } from 'fs-extra';
import { Injectable } from '@nestjs/common';
import { unlink, writeFile } from 'fs';
import { resolve } from 'path';
import { v4 } from 'uuid';

@Injectable()
export class FilesService {
  private async saveFile(path: string, fileName: string, file: Express.Multer.File): Promise<string> {
    await ensureDir(path);

    const filePath = `${path}\\${fileName}`;
    await writeFile(filePath, file.buffer, (err) => {
      if (err) throw err;
    });

    return fileName;
  }

  private async removeFile(path: string, fileName: string): Promise<void> {
    await ensureDir(path);

    const filePath = `${path}\\${fileName}`;
    await unlink(filePath, (err) => {
      if (err) throw err;
    });
  }

  async saveAvatar(userId: string, file: Express.Multer.File, previousAvatar: string): Promise<string> {
    const folderPath = resolve('static', 'users', userId, 'avatar');
    if (previousAvatar) {
      await this.removeFile(folderPath, previousAvatar);
    }
    const fileName = v4() + '.jpg';
    return await this.saveFile(folderPath, fileName, file);
  }

  async removeAvatar(userId: string, avatar: string): Promise<void> {
    const filePath = resolve('static', 'users', userId, 'avatar');
    await this.removeFile(filePath, avatar);
  }
}
