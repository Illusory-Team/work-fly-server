import { PrismaModule } from 'prisma/prisma.module';
import { forwardRef, Module } from '@nestjs/common';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { FolderAppearancesModule } from './appearance/folder-appearances.module';
import { FolderTypesService } from './folder-types/folder-types.service';
import { FoldersHandlers } from './commands';
import { CqrsModule } from '@nestjs/cqrs';
import { FolderTypeHandlers } from './folder-types/commands';

@Module({
  providers: [FoldersService, FolderTypesService, ...FoldersHandlers, ...FolderTypeHandlers],
  controllers: [FoldersController],
  imports: [PrismaModule, CqrsModule, forwardRef(() => FolderAppearancesModule)],
  exports: [FoldersService],
})
export class FoldersModule {}
