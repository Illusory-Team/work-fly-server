import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileHandlers } from './commands';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  providers: [FilesService, ...FileHandlers],
  exports: [FilesService],
  imports: [CqrsModule],
})
export class FilesModule {}
