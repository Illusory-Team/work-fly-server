import { PrismaModule } from 'prisma/prisma.module';
import { forwardRef, Module } from '@nestjs/common';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { FolderAppearancesModule } from './appearance/folder-appearances.module';
import { FolderTypesService } from './folder-types/folder-types.service';
import { FolderCommandHandlers } from './commands';
import { CqrsModule } from '@nestjs/cqrs';
import { FolderTypeQueryHandlers } from './folder-types/queries';
import { FolderQueryHandlers } from './queries';

@Module({
  providers: [
    FoldersService,
    FolderTypesService,
    ...FolderCommandHandlers,
    ...FolderQueryHandlers,
    ...FolderTypeQueryHandlers,
  ],
  controllers: [FoldersController],
  imports: [PrismaModule, CqrsModule, forwardRef(() => FolderAppearancesModule)],
  exports: [FoldersService],
})
export class FoldersModule {}
