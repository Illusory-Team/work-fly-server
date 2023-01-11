import { AccessJwtPayload } from '.';
export type RefreshJwtPayload = AccessJwtPayload & {
  refreshToken: string
}