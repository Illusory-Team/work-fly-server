import { ApiProperty } from '@nestjs/swagger';
import { TokensDto } from 'tokens/dto';
import { AuthResponseDto } from '../responses/auth-response.dto';

export class UserReturnDto {
  @ApiProperty({ description: 'User data without password' })
  data: AuthResponseDto;

  @ApiProperty({ description: 'Refresh and Access tokens' })
  tokens: TokensDto;
}
