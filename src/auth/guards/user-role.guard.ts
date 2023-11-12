import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/auth.decorator';
import { User } from '@prisma/client';
import { ValidRoles } from '../interfaces';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    const roles: ValidRoles[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    return !roles.length
      ? true
      : roles.some((role) => user.roles.includes(role));
  }
}
