import { UserDataDto } from './dto';

export interface AuthReturn {
  data: UserDataDto;
  refreshToken: string;
}
