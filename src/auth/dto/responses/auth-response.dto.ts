import { ApiProperty, PickType } from '@nestjs/swagger';
import { TOKEN } from '@constants/swagger';
import { UserDataDto } from '../user-data.dto';

export class AuthResponseDto extends PickType(UserDataDto, ['user'] as const) {
  // csrfToken adds only on auth response
  @ApiProperty({ example: TOKEN })
  csrfToken?: string;
}
