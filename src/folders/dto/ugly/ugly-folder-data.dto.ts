import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserFolderDto } from '../user-folder.dto';
import { UsersCountDto } from '../users-count.dto';

export class UglyFolderDataDto extends PickType(UsersCountDto, ['_count'] as const) {
  @ApiProperty({ example: '1efe537f-e380-4168-959b-f864f2196369' })
  id;

  @ApiProperty({ example: 'Frontend tasks' })
  @IsString()
  @IsNotEmpty()
  name;

  //tasks   //in progress

  folderAppearance: { icon: { icon: string }; color: { color: string } };

  folderType: { type: string };

  @ApiProperty({ description: 'Folder members minimum object data' })
  users: { users: UserFolderDto }[];

  @ApiProperty({ description: 'Folder owner minimum object data' })
  owner: UserFolderDto;
}
