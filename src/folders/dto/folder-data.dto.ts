import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import { FolderAppearanceDataDto } from '../appearance/dto';
import { UserFolderDto } from './user-folder.dto';
import { UsersCountDto } from './users-count.dto';

export class FolderDataDto extends PickType(UsersCountDto, ['_count'] as const) {
  @ApiProperty({ example: '1efe537f-e380-4168-959b-f864f2196369' })
  id: string;

  @ApiProperty({ example: 'Frontend tasks' })
  @IsString()
  @IsNotEmpty()
  name: string;

  //tasks   //in progress

  @ApiProperty({ example: FolderAppearanceDataDto })
  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => FolderAppearanceDataDto)
  folderAppearance: FolderAppearanceDataDto;

  @ApiProperty({ example: 'default' })
  @IsString()
  @IsNotEmpty()
  folderType: string;

  @ApiProperty({ description: 'Folder members minimum object data', isArray: true, type: UserFolderDto })
  users: UserFolderDto[];

  @ApiProperty({ description: 'Folder owner minimum object data' })
  owner: UserFolderDto;
}
