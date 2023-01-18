import { AccessJwtPayload } from '.';
export interface RefreshJwtPayload extends AccessJwtPayload {
  refreshToken: string
}