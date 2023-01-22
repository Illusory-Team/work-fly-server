import { CreateUserDto } from 'src/users/dto';
import { CreateCompanyDto } from 'src/companies/dto';

export class RegisterUserOwnerDto {
  company: CreateCompanyDto
  user: CreateUserDto
}
