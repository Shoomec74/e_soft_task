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

  @CheckAbility({ action: Action.Create, subject: CreateTaskDto })
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: TJwtRequest) {
    return await this.tasksService.create(
      createTaskDto,
      req.user.id,
      req.ability,
    );
  }

  @CheckAbility({ action: Action.Read, subject: CreateTaskDto })
  @Get()
  //-- TODO: создать правило или проверку чтобы пользователь получал только свои таски --//
  async findAllTasksForUser(@Req() req: TJwtRequest) {
    return await this.tasksService.findAllTasksForUser(req.user.id);
  }

  @CheckAbility({ action: Action.Update, subject: UpdateTaskDto })
  @Patch(':taskId')
  update(
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: TJwtRequest,
  ) {
    return this.tasksService.update(
      +taskId,
      updateTaskDto,
      req.user.id,
      req.ability,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tasksService.remove(+id);
  }
}
