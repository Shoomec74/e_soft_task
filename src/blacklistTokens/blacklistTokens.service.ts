import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { decode } from 'jsonwebtoken';
import { BlacklistTokens } from './entities/blacklistTokens.entity';

@Injectable()
export class BlacklistTokensService {
  constructor(
    @InjectRepository(BlacklistTokens)
    private readonly blacklistTokensRepository: Repository<BlacklistTokens>,
  ) {}

  //-- Удаляем истекшие токены из БД --//
  private async cleanupTokens(): Promise<void> {
    const now = new Date();
    await this.blacklistTokensRepository.delete({
      expirationDate: LessThan(now),
    });
  }

  async addToken(token: string): Promise<void> {
    const existingToken = await this.blacklistTokensRepository.findOne({
      where: { token },
    });

    if (existingToken) {
      // Токен уже существует, возможно, обновить expirationDate или просто вернуть управление
      return;
    }

    // Декодируем токен без проверки подлинности
    const decodedToken: any = decode(token);

    // Проверяем, существует ли поле exp в декодированном токене
    if (!decodedToken?.exp) {
      throw new BadRequestException('Невалидный токен');
    }

    // Преобразуем временную метку UNIX в объект Date
    const expirationDate = new Date(decodedToken.exp * 1000);

    // Создаем новый экземпляр сущности и сохраняем его
    const blacklistedToken = this.blacklistTokensRepository.create({
      token,
      expirationDate,
    });

    await this.blacklistTokensRepository.save(blacklistedToken);

    // Вызываем метод очистки, если он у вас есть
    await this.cleanupTokens();
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const count = await this.blacklistTokensRepository.count({
      where: { token },
    });
    return count > 0;
  }
}
