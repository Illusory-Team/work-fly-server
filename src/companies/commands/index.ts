export { CreateCompanyCommand } from './create-company';
export { GetCompanyCommand } from './get-company';
export { PatchCompanyCommand } from './patch-company';

import { CreateCompanyHandler } from './create-company';
import { GetCompanyHandler } from './get-company';
import { PatchCompanyHandler } from './patch-company';

export const CompaniesHandlers = [CreateCompanyHandler, GetCompanyHandler, PatchCompanyHandler];
