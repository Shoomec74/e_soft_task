import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { BlacklistTokensService } from 'src/blacklistTokens/blacklistTokens.service';

//-- Сервис для аутентификации с использованием JWT --//
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private blacklistTokensService: BlacklistTokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //-- Функция для извлечения JWT из заголовка авторизации --//
      secretOrKey: configService.get('JWT_SECRET'), //-- Секретный ключ для верификации JWT --//
      passReqToCallback: true, //-- Передача объекта запроса в метод validate --//
    });
  }

  //-- Метод для валидации пользователя по токену JWT --//
  async validate(request: any, jwtPayload: { sub: number }): Promise<User> {
    //-- Извлечение токена из заголовка запроса --//
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    //-- Поиск пользователя по идентификатору из полезной нагрузки токена --//
    const user = await this.usersService.findOne(jwtPayload.sub);

    //-- Проверка, находится ли токен в черном списке или пользователь не найден --//
    if (
      (await this.blacklistTokensService.isTokenBlacklisted(token)) ||
      !user
    ) {
      //-- Если условие выполняется, генерируется исключение о неавторизации --//
      throw new UnauthorizedException('Пользователь не авторизован');
    } else {
      //-- Возвращение данных пользователя, если токен действителен и не в черном списке --//
      return user;
    }
  }
}
