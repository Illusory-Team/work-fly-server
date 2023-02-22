import { ApiProperty } from '@nestjs/swagger';

class UsersCount {
  @ApiProperty()
  users: number;
}

//it's still ugly because of tasks field will be here as well
export class UsersCountDto {
  @ApiProperty({ description: "Count of folder's members", example: 1 })
  _count: UsersCount; // Count of users (without owner)
}
