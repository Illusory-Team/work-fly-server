export { CreateCompanyCommand } from './create-company';
export { PatchCompanyCommand } from './patch-company';

import { CreateCompanyCommandHandler } from './create-company';
import { PatchCompanyCommandHandler } from './patch-company';

export const CompanyCommandHandlers = [CreateCompanyCommandHandler, PatchCompanyCommandHandler];
