import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image',
}

@Injectable()
export class FileService {
  private createPathToStaticDirectory(otherPath: string) {
    return path.resolve(__dirname, '..', 'static', otherPath);
  }

  createFile(type: FileType, file): string {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${uuid.v4()}.${fileExtension}`;
      const filePath = this.createPathToStaticDirectory(type);

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);

      return `${type}/${fileName}`;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  removeFile(filePath: string) {
    try {
      const fullFilePath = this.createPathToStaticDirectory(filePath);
      if (fs.existsSync(fullFilePath)) {
        fs.rmSync(fullFilePath);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
