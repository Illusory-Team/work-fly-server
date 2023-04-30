import { TokensModule } from '../tokens/tokens.module';
import { PrismaModule } from '../prisma/prisma.module';
import { forwardRef, Module } from '@nestjs/common';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { UsersModule } from 'src/users/users.module';
import { FolderAppearancesModule } from './appearance/folder-appearances.module';
import { FolderTypesService } from './services/folder-types.service';

@Module({
  controllers: [FoldersController],
  providers: [FoldersService, FolderTypesService],
  imports: [PrismaModule, TokensModule, UsersModule, forwardRef(() => FolderAppearancesModule)],
  exports: [FoldersService],
})
export class FoldersModule {}
