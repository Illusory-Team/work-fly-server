import { UserDataDto } from './dto';

export interface AuthReturn {
  data: UserDataDto;
  refreshToken: string;
}

export interface RefreshAuthReturn {
  data: UserDataDto;
  refreshToken: string;
}
