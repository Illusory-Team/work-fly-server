import { FolderAppearancesController } from './folder-appearances.controller';
import { FoldersModule } from '../folders.module';
import { TokensModule } from '../../tokens/tokens.module';
import { ColorsModule } from '../../colors/colors.module';
import { FolderIconsService } from './services/folder-icons.service';
import { FolderAppearancesService } from './folder-appearances.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  controllers: [FolderAppearancesController],
  providers: [FolderAppearancesService, FolderIconsService],
  imports: [PrismaModule, ColorsModule, TokensModule, FoldersModule],
  exports: [FolderAppearancesService],
})
export class FolderAppearancesModule {}
