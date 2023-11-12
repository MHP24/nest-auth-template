import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';
import { META_ROLES } from './auth.decorator';

export const RoleProtected = (...args: ValidRoles[]) =>
  SetMetadata(META_ROLES, args);
