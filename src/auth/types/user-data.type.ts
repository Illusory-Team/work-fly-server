import { Tokens } from "src/tokens/types"
import { PureUserDto } from "../../users/dto/pure-user.dto"

export type UserData = {
  user: PureUserDto
  tokens: Tokens
}