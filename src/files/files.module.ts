import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileCommandHandlers } from './commands';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  providers: [FilesService, ...FileCommandHandlers],
  exports: [FilesService],
  imports: [CqrsModule],
})
export class FilesModule {}
