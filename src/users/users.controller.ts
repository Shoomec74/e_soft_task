import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CheckAbility } from 'src/auth/decorators/ability.decorator';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import { TransformUserDtoPipe } from 'src/auth/pipes/signup.pipe';
import { User } from './entities/user.entity';
import { Action } from 'src/ability/ability.factory';

@UseGuards(JwtGuard, AbilityGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @CheckAbility({ action: Action.Create, subject: CreateUserDto })
  @Post()
  async register(
    @Body(TransformUserDtoPipe) createUserDto: CreateUserDto,
  ): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @CheckAbility({ action: Action.Read, subject: CreateUserDto })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @CheckAbility({ action: Action.Update, subject: CreateUserDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @CheckAbility({ action: Action.Delete, subject: CreateUserDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
