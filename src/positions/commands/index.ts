export { CreatePositionCommand } from './create-position';
export { GetPositionCommand } from './get-position';

import { CreatePositionHandler } from './create-position';
import { GetPositionHandler } from './get-position';

export const PositionHandlers = [CreatePositionHandler, GetPositionHandler];
