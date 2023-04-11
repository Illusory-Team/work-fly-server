import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserReturnDto } from '../return/user-return.dto';

export class AuthResponseDto extends PickType(UserReturnDto, ['user'] as const) {
  // csrfToken adds only on auth response
  @ApiProperty({ example: 'eyJhbGciOiJIUcCI6IkpXVCJ9.eyJ1c2VySsImV4cCI6MTY3NDY1NjE0MX0.KCs-e0FqFqy44Zg5wpo' })
  csrfToken?: string;
}
