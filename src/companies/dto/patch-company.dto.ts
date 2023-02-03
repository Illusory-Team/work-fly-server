import { CompanyDataDto } from './company-data.dto';
import { PartialType, PickType } from '@nestjs/swagger';

export class PatchCompanyDto extends PartialType(
  PickType(CompanyDataDto, ['name', 'phone', 'email', 'address', 'description'] as const),
) {}
