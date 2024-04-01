import { createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((_, req) => {
  const request = req.switchToHttp().getRequest();
  return request.user;
});
