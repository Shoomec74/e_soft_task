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
  Req,
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
import { TJwtRequest } from 'src/utils/types/types';

@UseGuards(JwtGuard, AbilityGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @CheckAbility({ action: Action.Create, subject: CreateUserDto })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async register(
    @Body(TransformUserDtoPipe) createUserDto: CreateUserDto,
    @Req() req: TJwtRequest,
  ): Promise<User> {
    return await this.usersService.create(createUserDto, req.ability);
  }

  @CheckAbility({ action: Action.Read, subject: CreateUserDto })
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @CheckAbility({ action: Action.Read, subject: CreateUserDto })
  @Get('me')
  async find(@Req() req: TJwtRequest) {
    return await this.usersService.findMe(req.user.id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @CheckAbility({ action: Action.Update, subject: CreateUserDto })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(+id, updateUserDto);
  }

  @CheckAbility({ action: Action.Delete, subject: CreateUserDto })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}
