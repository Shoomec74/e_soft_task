import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { CheckAbility } from 'src/auth/decorators/ability.decorator';
import { Action } from 'src/ability/ability.factory';
import { TJwtRequest } from 'src/utils/types/types';
import { UpdateTaskDto } from './dto/update-task.dto';

@UseGuards(JwtGuard, AbilityGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @CheckAbility({ action: Action.Update, subject: CreateTaskDto })
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: TJwtRequest) {
    return await this.tasksService.create(createTaskDto, req.user.id);
  }

  @CheckAbility({ action: Action.Read, subject: CreateTaskDto })
  @Get(':userId')
  //-- TODO: создать правило или проверку чтобы пользователь получал только свои таски --//
  async findAllTasksForUser(@Param('userId') userId: number) {
    return await this.tasksService.findAllTasksForUser(userId);
  }

  @CheckAbility({ action: Action.Update, subject: CreateTaskDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: TJwtRequest,
  ) {
    return this.tasksService.update(+id, updateTaskDto, req.ability);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tasksService.remove(+id);
  }
}
