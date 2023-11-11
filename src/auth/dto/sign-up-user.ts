import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}
