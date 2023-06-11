import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { ColorsModule } from 'colors/colors.module';
import { FolderIconsService } from './folder-icons/folder-icons.service';
import { FolderAppearancesService } from './folder-appearances.service';
import { PrismaModule } from 'prisma/prisma.module';
import { FoldersModule } from '../folders.module';
import { FolderAppearancesController } from './folder-appearances.controller';
import { FolderAppearanceHandlers } from './commands';
import { FolderIconHandlers } from './folder-icons/commands';

@Module({
  controllers: [FolderAppearancesController],
  providers: [FolderAppearancesService, FolderIconsService, ...FolderAppearanceHandlers, ...FolderIconHandlers],
  imports: [PrismaModule, CqrsModule, ColorsModule, FoldersModule],
  exports: [FolderAppearancesService],
})
export class FolderAppearancesModule {}
