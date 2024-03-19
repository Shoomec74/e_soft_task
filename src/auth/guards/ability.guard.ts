import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from 'src/ability/ability.factory';
import { CHECK_ABILITY, RequiredRules } from '../decorators/ability.decorator';
import { ForbiddenError } from '@casl/ability';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AbilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: AbilityFactory,
    private readonly usersService: UsersService,
  ) {}

  //-- Метод canActivate определяет, может ли пользователь выполнить действие, основываясь на его правах --//
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //-- Получаем правила доступа, связанные с текущим действием --//
    const rules =
      this.reflector.get<RequiredRules[]>(
        CHECK_ABILITY,
        context.getHandler(),
      ) || [];

    //-- Получаем запрос из контекста выполнения --//
    const request = context.switchToHttp().getRequest();

    //-- Проверяем, авторизован ли пользователь --//
    if (request?.user) {
      const ability = await this.caslAbilityFactory.defineAbility(request.user);

      try {
        //-- Для каждого правила проверяем, разрешено ли действие --//
        rules.forEach((rule) => {
          ForbiddenError.from(ability).throwUnlessCan(
            rule.action,
            rule.subject,
          );
        });

        //-- Если все проверки пройдены, насыщаем запрос правилами для возможности создавать более сложные ии глубокие правила непосредственно в репозиториях и возвращаем true --//
        request.ability = ability;

        return true;
      } catch (e) {
        if (e instanceof ForbiddenError) {
          throw new ForbiddenException(e.message);
        }
        //-- В случае исключения (например, пользователь не имеет права на действие), возвращаем false --//
        return false;
      }
    }

    //-- Если пользователь не авторизован, возвращаем false --//
    return false;
  }
}
