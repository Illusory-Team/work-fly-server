import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { ColorsModule } from 'colors/colors.module';
import { FolderIconsService } from './folder-icons/folder-icons.service';
import { FolderAppearancesService } from './folder-appearances.service';
import { PrismaModule } from 'prisma/prisma.module';
import { FoldersModule } from '../folders.module';
import { FolderAppearancesController } from './folder-appearances.controller';
import { FolderAppearanceCommandHandlers } from './commands';
import { FolderIconQueryHandlers } from './folder-icons/queries';

@Module({
  controllers: [FolderAppearancesController],
  providers: [
    FolderAppearancesService,
    FolderIconsService,
    ...FolderAppearanceCommandHandlers,
    ...FolderIconQueryHandlers,
  ],
  imports: [PrismaModule, CqrsModule, ColorsModule, FoldersModule],
  exports: [FolderAppearancesService],
})
export class FolderAppearancesModule {}
