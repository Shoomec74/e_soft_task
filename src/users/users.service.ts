import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { getHash } from 'src/utils/hashService';
import { UserRole } from 'src/utils/types/types';
import { PureAbility } from '@casl/ability';
import { Action } from 'src/ability/ability.factory';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async ensureSuperAdminExists() {
    const superAdminLogin = this.configService.get<string>('LOGIN_SUPERADMIN'); // Вы должны заменить это на то, как вы определяете superAdmin
    let superAdmin = await this.userRepository.findOne({
      where: { login: superAdminLogin },
    });

    if (!superAdmin) {
      superAdmin = this.userRepository.create({
        firstName: 'Super',
        lastName: 'Admin',
        login: superAdminLogin,
        role: UserRole.SUPERADMIN,
        accessToken: '',
        refreshToken: '',
        password: await getHash(
          this.configService.get<string>('PASSWORD_SUPERADMIN'),
        ),
      });

      await this.userRepository.insert(superAdmin);
    }

    return superAdmin;
  }

  async create(
    createUserDto: CreateUserDto,
    ability?: PureAbility,
  ): Promise<User> {
    const hashedPassword = await getHash(createUserDto.password);
    let user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Суперадмин не может создавать суперадминистратора
    if (!ability?.can(Action.Create, user)) {
      throw new ConflictException('Суперадмин уже существует');
    }

    try {
      user = await this.userRepository.save(user);

      // Назначаем менеджера подчиненному
      if (createUserDto.managerId) {
        const manager = await this.userRepository.findOne({
          where: { id: createUserDto.managerId },
        });
        if (!manager) throw new NotFoundException('Менеджер не найден');
        user.manager = manager;
      }

      // Добавляем подчиненных менеджеру
      if (
        createUserDto.subordinateIds &&
        createUserDto.subordinateIds.length > 0
      ) {
        const subordinates = await this.userRepository.findBy({
          id: In(createUserDto.subordinateIds),
        });
        user.subordinates = subordinates;
      }

      // Сохраняем изменения
      return await this.userRepository.save(user);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException(
          'Пользователь с таким username или email уже существует',
        );
      }
      throw e;
    }
  }

  async findAll() {
    try {
      return await this.userRepository.find({
        where: {
          role: Not(UserRole.SUPERADMIN),
        },
        relations: {
          manager: true, // Загрузка информации о менеджере
          subordinates: true, // Загрузка информации о подчиненных
        },
      });
    } catch (e) {
      return e;
    }
  }

  async findOne(id: number) {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if (updateUserDto.password.length) {
        updateUserDto.password = await getHash(updateUserDto.password);
      }

      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      // Применяем изменения к найденному пользователю
      Object.assign(user, updateUserDto);

      // Сохраняем обновленную сущность
      await this.userRepository.save(user);

      return user;
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException(
          'Пользователь с таким username или email уже существует',
        );
      }
      return e;
    }
  }

  async remove(id: number) {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Пользователь не найден');
      } else {
        return { success: true };
      }
    } catch (e) {
      return e;
    }
  }

  async findMe(userId: number) {
    try {
      return await this.userRepository.findOne({
        where: {
          id: userId,
        },
        relations: {
          manager: true, // Загрузка информации о менеджере
          subordinates: true, // Загрузка информации о подчиненных
        },
      });
    } catch (e) {
      return e;
    }
  }
}
