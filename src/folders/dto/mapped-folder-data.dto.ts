import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import { ENTITY_ID } from '@constants/swagger';
import { MappedFolderAppearanceDataDto } from '../appearance/dto';
import { UserFolderDto } from './user-folder.dto';
import { UsersCountDto } from './users-count.dto';

export class MappedFolderDataDto extends PickType(UsersCountDto, ['_count'] as const) {
  @ApiProperty({ example: ENTITY_ID })
  id: string;

  @ApiProperty({ example: 'Frontend tasks' })
  @IsString()
  @IsNotEmpty()
  name: string;

  //tasks   //in progress

  @ApiProperty({ example: MappedFolderAppearanceDataDto })
  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => MappedFolderAppearanceDataDto)
  folderAppearance: MappedFolderAppearanceDataDto;

  @ApiProperty({ example: 'default' })
  @IsString()
  @IsNotEmpty()
  folderType: string;

  @ApiProperty({ description: 'Folder members minimum object data', isArray: true, type: UserFolderDto })
  users: UserFolderDto[];

  @ApiProperty({ description: 'Folder owner minimum object data' })
  owner: UserFolderDto;
}
