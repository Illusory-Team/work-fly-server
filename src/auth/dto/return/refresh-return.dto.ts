import { PickType } from '@nestjs/swagger';
import { TokensDto } from 'tokens/dto';

export class RefreshReturnDto extends PickType(TokensDto, ['accessToken']) {}
