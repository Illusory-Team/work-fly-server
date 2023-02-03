import { CompanyDataDto } from './company-data.dto';
import { PickType } from '@nestjs/swagger';

export class CreateCompanyDto extends PickType(CompanyDataDto, ['name'] as const) {}
