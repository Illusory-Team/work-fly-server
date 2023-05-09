import { CreateUserDto } from 'users/dto';
import { CreateCompanyDto } from 'companies/dto';

export class RegisterUserOwnerDto {
  company: CreateCompanyDto;
  user: CreateUserDto;
}
