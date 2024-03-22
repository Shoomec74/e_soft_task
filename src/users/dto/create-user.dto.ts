import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from 'src/utils/types/types';

export class CreateUserDto {
  @Length(1, 30)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Length(1, 30)
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Length(1, 30)
  @IsString()
  @IsNotEmpty()
  middleName: string;

  @Length(6, 50)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  login: string;

  @Length(4, 20)
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @IsOptional()
  role?: UserRole;

  @IsOptional()
  @IsInt({ each: true })
  subordinateIds?: number[]; // Для менеджера: ID подчиненных

  @IsOptional()
  @IsInt()
  managerId?: number; // Для подчиненного: ID менеджера
}
