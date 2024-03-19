import { PipeTransform, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class TransformUserDtoPipe implements PipeTransform {
  transform(value: CreateUserDto): CreateUserDto {
    // Пример изменения: добавление домена к электронной почте, если он отсутствует
    const userReg = { ...value, accessToken: '', refreshToken: '' };

    // Вы можете добавить здесь любую другую логику трансформации
    return userReg;
  }
}
