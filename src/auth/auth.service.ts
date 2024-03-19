import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { isPasswordCorrect } from 'src/utils/hashService';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ITokens } from 'src/utils/types/types';
import { BlacklistTokensService } from 'src/blacklistTokens/blacklistTokens.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private blacklistTokensService: BlacklistTokensService,
  ) {}
  //-- Метод для проверки пароля пользователя --//
  async validatePassword(userLogin: string, password: string): Promise<User> {
    //-- Поиск аккаунта по электронной почте и типу аккаунта (в данном случае локальный аккаунт) --//
    const user = await this.usersRepository.findOne({
      where: { login: userLogin },
    });

    //-- Если аккаунт не найден, выбрасывается исключение --//
    if (!user) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    } else {
      //-- Проверка соответствия введенного пароля сохраненному в базе данных --//
      const isPasswordMatched = await isPasswordCorrect(
        password, //-- Введенный пароль --//
        user.password, //-- Пароль, сохраненный в базе данных --//
      );

      //-- Если пароли не совпадают, выбрасывается исключение --//
      if (!isPasswordMatched) {
        throw new UnauthorizedException('Неверное имя пользователя или пароль');
      } else {
        //-- В случае успешной проверки возвращается профиль пользователя --//
        return user;
      }
    }
  }

  //-- Метод для генерации пары токенов доступа и обновления --//
  private async getTokens(userId): Promise<ITokens> {
    //-- Базовый пейлоад для токенов, содержащий идентификатор профиля (sub) --//
    const basePayload = { sub: userId };

    //-- Пейлоад для токена доступа с добавлением уникального идентификатора (jti) и указанием типа токена --//
    const accessTokenPayload = {
      ...basePayload,
      jti: randomBytes(16).toString('hex'), // Генерация случайного идентификатора JWT
      type: 'access',
    };

    //-- Пейлоад для токена обновления с добавлением уникального идентификатора (jti) и указанием типа токена --//
    const refreshTokenPayload = {
      ...basePayload,
      jti: randomBytes(16).toString('hex'), // Генерация случайного идентификатора JWT
      type: 'refresh',
    };

    //-- Создание токена доступа с использованием пейлоада токена доступа --//
    const accessToken = this.jwtService.sign(accessTokenPayload);

    //-- Создание токена обновления с использованием пейлоада токена обновления и установкой срока действия --//
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: this.configService.get('REFRESHTOKEN_EXPIRESIN'), //-- Срок действия токена обновления --//
    });

    //-- Возвращение объекта с токенами доступа и обновления --//
    return { accessToken, refreshToken };
  }

  //-- Метод для аутентификации пользователя и получения токенов доступа и обновления --//
  async auth(userId: number) {
    //-- Генерация токенов доступа и обновления для профиля пользователя --//
    const tokens = await this.getTokens(userId);

    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if ('accessToken' in user && user.accessToken !== '') {
      await this.blacklistTokensService.addToken(user.accessToken);
    }

    //-- Сохранение токена обновления в базе данных и получение обновленного профиля --//
    const authProfile = await this.usersRepository.save({
      ...user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    delete authProfile.password;

    return authProfile;
  }
}
