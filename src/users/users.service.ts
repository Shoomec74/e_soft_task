import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { getHash } from 'src/utils/hashService';
import { UserRole } from 'src/utils/types/types';

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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await getHash(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    try {
      return await this.userRepository.save(user);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException(
          'Пользователь с таким username или email уже существует',
        );
      }
      return e;
    }
  }

  async findAll() {
    try {
      return await this.userRepository.find({
        where: {
          role: Not(UserRole.SUPERADMIN),
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
}
