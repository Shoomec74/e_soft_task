import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  // MatchConditions,
  PureAbility,
  FieldMatcher,
  buildMongoQueryMatcher,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';
import { Task } from 'src/tasks/entities/task.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
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
  ACCESS = 'access',
}

export type Subjects = InferSubjects<
  | typeof CreateUserDto
  | typeof CreateTaskDto
  | typeof UpdateTaskDto
  | typeof UpdateUserDto
  | 'all'
>;

@Injectable()
export class AbilityFactory {
  constructor(
    @InjectRepository(User)
    @InjectRepository(Task)
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

    type AppAbility = PureAbility<
      [Action, Subjects | typeof User | typeof Task]
    >;

    //const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

    const fieldMatcher: FieldMatcher = (fields) => (field) =>
      fields.includes(field);
    const conditionsMatcher = buildMongoQueryMatcher();

    const isSuperAdmin = this.getRole(user, UserRole.SUPERADMIN);
    const isManager = this.getRole(user, UserRole.MANAGER);
    //const isSubordinate = this.getRole(user, UserRole.SUBORDINATE);

    //-- Создаем строитель AbilityBuilder, который поможет нам определить правила доступа --//
    const { can, build } = new AbilityBuilder<AppAbility>(PureAbility);

    //-- Здесь определяем правила доступа --//
    if (isSuperAdmin) {
      can(Action.Create, User, (user: User) => {
        return user.role !== UserRole.SUPERADMIN;
      });

      can(Action.Manage, [
        CreateUserDto,
        CreateTaskDto,
        UpdateTaskDto,
        UpdateUserDto,
      ]);

      can(Action.ACCESS, 'all');
    } else if (isManager) {
      can(Action.ACCESS, CreateUserDto);

      can([Action.Create, Action.Read], [CreateTaskDto]);
      //-- Руководитель может создавать таски себе и подчиненным --//
      can(Action.Create, Task, (task) => {
        return task.creator.id === user.id || task.assignee;
      });
      can([Action.Update, Action.Read], UpdateTaskDto);
      can(Action.Update, Task, {
        'creator.id': { $eq: user.id },
        assignee: { $exists: true },
      });
    } else {
      can([Action.Update, Action.Read], UpdateTaskDto);

      can(Action.Update, Task, {
        'creator.id': { $eq: user.id },
        assignee: { $eq: null },
      });

      can(Action.ACCESS, CreateUserDto);
      can(Action.Create, CreateTaskDto);
      //-- Подчиненный может создавать таски только для себя --//
      can(Action.Create, Task, (task) => {
        return task.creator.id === user.id && !task.assignee;
      });
      can(Action.Read, CreateTaskDto);
    }

    //-- Возвращаем сформированный набор правил в гарду --//
    return build({
      conditionsMatcher: conditionsMatcher,
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
      fieldMatcher,
    });
  }
}
