import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MatchConditions,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/utils/types/types';
import { Repository } from 'typeorm';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Share = 'share',
  Copy = 'copy',
}

export type Subjects = InferSubjects<typeof CreateUserDto | 'all'>;

@Injectable()
export class AbilityFactory {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  private getRole(user: User, soughtRole: string): boolean {
    if (UserRole.SUPERADMIN === soughtRole) {
      return (
        user.login === this.configService.get<string>('LOGIN_SUPERADMIN') &&
        user.role === soughtRole
      );
    }
    return user.role === soughtRole;
  }

  //-- Функция defineAbility определяет, что может делать пользователь в приложении --//
  async defineAbility(user: User): Promise<PureAbility> {
    /*
      Для того чтобы организовать сложные правила, например для изменения, создания и т.д. с моделями ботов, 
      необходимо работать не с DTO, и не с моделью Bots из БД, 
      используйте именно заинжектированную модель из БД например this.botModel 
      так фабрика получит корректный Subjects передаваемого бота из репозитория в правило для проверки.
    */
    type AppAbility = PureAbility<[Action, Subjects]>;
    const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

    const isSuperAdmin = this.getRole(user, UserRole.SUPERADMIN);
    // const isManager = this.getRole(user, UserRole.MANAGER);
    // const isSubordinate = this.getRole(user, UserRole.SUBORDINATE);

    //-- Создаем строитель AbilityBuilder, который поможет нам определить правила доступа --//
    const { can, build } = new AbilityBuilder<AppAbility>(PureAbility);

    //-- Здесь определяем правила доступа --//
    if (isSuperAdmin) {
      can(Action.Manage, 'all');
    }

    //-- Возвращаем сформированный набор правил в гарду --//
    return build({
      conditionsMatcher: lambdaMatcher,
      detectSubjectType: (object) =>
        object.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
