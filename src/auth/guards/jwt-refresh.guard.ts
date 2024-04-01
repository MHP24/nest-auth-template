import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = (request.headers.authorization ?? '').split(' ')[1];
      if (!token) return false;

      const verification = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      request.userId = verification.id;

      return true;
    } catch (error) {
      throw new ForbiddenException('Invalid token');
    }
  }
}
