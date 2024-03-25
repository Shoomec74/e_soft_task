import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PureAbility } from '@casl/ability';
import { Action } from 'src/ability/ability.factory';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    userId: number,
    ability: PureAbility,
  ): Promise<Task> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['subordinates'], // Использование массива строк для указания связей
      });

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }
      // Поиск assignee, если assigneeId предоставлен
      let assignee = null;
      if (createTaskDto.assigneeId) {
        if (user.subordinates) {
          // Поиск индекса assignee в массиве подчиненных
          const find = user.subordinates.some(
            (subordinate) => subordinate.id === +createTaskDto.assigneeId,
          );

          if (!find) {
            // Если assignee не найден в массиве подчиненных, выбрасываем исключение
            throw new BadRequestException(
              'Задачи можно назначать только вашим подчиненным.',
            );
          }
        } else {
          // Если у пользователя нет подчиненных, также выбрасываем исключение
          throw new BadRequestException(
            'У данного пользователя нет подчиненных.',
          );
        }

        assignee = await this.userRepository.findOneBy({
          id: createTaskDto.assigneeId,
        });
        if (!assignee) {
          throw new NotFoundException('Assignee не найден');
        }
      }

      const task = this.taskRepository.create({
        ...createTaskDto,
        creator: user,
        assignee, // добавляем assignee только если он найден
      });

      // Проверяем, имеет ли пользователь право создать задачу
      if (!ability.can(Action.Create, task)) {
        throw new BadRequestException('Нет прав на создание задачи');
      }

      // Сохраняем и возвращаем сохраненную задачу
      return await this.taskRepository.save(task);
    } catch (e) {
      // Обработка исключений, возможно, лучше возвращать конкретный тип ошибки
      throw new BadRequestException(e.message);
    }
  }

  async findAllTasksForUser(userId: number): Promise<Task[]> {
    try {
      // Находим все задачи, созданные пользователем или назначенные на него
      const tasks = await this.taskRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.creator', 'creator')
        .leftJoinAndSelect('task.assignee', 'assignee')
        .where('task.creatorId = :userId OR task.assigneeId = :userId', {
          userId,
        })
        .getMany();

      return tasks;
    } catch (e) {
      return e;
    }
  }

  async update(
    taskId: number,
    updateTaskDto: UpdateTaskDto,
    userId: number,
    ability?: PureAbility,
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['creator', 'assignee'],
    });

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['subordinates'], // Использование массива строк для указания связей
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    }

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (!ability.can(Action.Update, task)) {
      task.status = updateTaskDto.status;

      await this.taskRepository.save(task);

      return await this.taskRepository.findOne({
        where: { id: task.id },
        relations: ['creator', 'assignee'], // Указываем, что хотим получить полные данные о этих сущностях
      });
    }

    // Обновление assignee
    if (updateTaskDto.assigneeId) {
      const newAssignee = await this.userRepository.findOneBy({
        id: updateTaskDto.assigneeId,
      });

      if (!newAssignee) {
        throw new NotFoundException(
          `User with ID ${updateTaskDto.assigneeId} not found.`,
        );
      }

      const isSubordinate = user.subordinates.some(
        (subordinate) => subordinate.id === newAssignee.id,
      );

      if (!isSubordinate) {
        throw new ForbiddenException(
          `The new assignee must be a subordinate of the task creator.`,
        );
      }

      // Установка нового assignee
      task.assignee = newAssignee;
    }

    // Обновление других полей задачи
    Object.assign(task, updateTaskDto);

    await this.taskRepository.save(task);

    return await this.taskRepository.findOne({
      where: { id: task.id },
      relations: ['creator', 'assignee'], // Указываем, что хотим получить полные данные о этих сущностях
    });
  }

  async remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
