import { createParamDecorator } from '@nestjs/common';

export const GetUserId = createParamDecorator((_, req) => {
  const request = req.switchToHttp().getRequest();
  return request.userId;
});
