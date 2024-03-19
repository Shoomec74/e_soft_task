import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @Length(0, 30)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Length(0, 30)
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Length(0, 30)
  @IsString()
  @IsNotEmpty()
  middleName: string;

  @Length(6, 50)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  login: string;

  @Length(8, 20)
  @IsString()
  @IsNotEmpty()
  password: string;
}
