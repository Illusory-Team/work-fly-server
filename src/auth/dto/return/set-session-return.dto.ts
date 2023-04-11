import { ApiProperty } from '@nestjs/swagger';
import { UserSessionDto } from '../user-session.dto';

export class SetSessionReturnDto extends UserSessionDto {
  @ApiProperty({ example: 'qwerty123' })
  password: string;
}
