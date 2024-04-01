import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((_, req: ExecutionContext) => {
  const request = req.switchToHttp().getRequest();
  return request.user;
});
