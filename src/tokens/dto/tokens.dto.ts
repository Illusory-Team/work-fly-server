import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUcCI6IkpXVCJ9.eyJ1c2VySsImV4cCI6MTY3NDY1NjE0MX0.KCs-e0FqFqy44Zg5wpo' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUcCI6IkpXVCJ9.eyJ1c2VySsImV4cCI6MTY3NDY1NjE0MX0.KCs-e0FqFqy44Zg5wpo' })
  refreshToken: string;
}
