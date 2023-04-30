import { ApiProperty } from '@nestjs/swagger';
import { TOKEN } from '@constants/swagger';

export class TokensDto {
  @ApiProperty({ example: TOKEN })
  accessToken: string;

  @ApiProperty({ example: TOKEN })
  refreshToken: string;
}
