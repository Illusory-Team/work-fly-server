import { PureUserDto } from '../../users/dto/pure-user.dto';
import { PickType } from '@nestjs/swagger';

export class UserFolderDto extends PickType(PureUserDto, ['id', 'fullName', 'avatar'] as const) {}
