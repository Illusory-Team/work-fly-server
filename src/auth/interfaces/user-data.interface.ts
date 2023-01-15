import { Tokens } from "src/tokens/interfaces"
import { PureUserDto } from "../../users/dto/pure-user.dto"

export type UserData = {
  user: PureUserDto
  tokens: Tokens
}