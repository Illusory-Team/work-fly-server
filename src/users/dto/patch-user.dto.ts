import { PureUserDto } from 'src/users/dto';
import { PartialType, PickType } from '@nestjs/swagger';

export class PatchUserDto extends PartialType(
  PickType(PureUserDto, ['email', 'phone', 'birthday', 'address', 'description'] as const),
) {}
