import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';

export const AuthRefresh = () => applyDecorators(UseGuards(JwtRefreshGuard));
