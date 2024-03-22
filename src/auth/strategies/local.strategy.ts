import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

//-- Сервис для реализации локальной стратегии аутентификации --//
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    //-- Инициализация базовой стратегии с указанием поля для имени пользователя --//
    super({
      usernameField: 'login', //-- Указываем, что в качестве "имени пользователя" используется поле 'login' --//
    });
  }

  //-- Функция валидации пользователя --//
  async validate(login: string, password: string) {
    try {
      //-- Вызов сервиса authService для проверки соответствия пароля и электронной почты --//
      const user = await this.authService.validatePassword(login, password);
      //-- Если проверка прошла успешно, возвращаем профиль пользователя --//
      return user;
    } catch (err) {
      //-- В случае ошибки валидации (например, если пароль неверен) выбрасываем исключение --//
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }
  }
}
