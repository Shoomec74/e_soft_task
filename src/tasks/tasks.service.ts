import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PureAbility } from '@casl/ability';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    const task = this.taskRepository.create({
      ...createTaskDto,
      creator: user,
    });
    try {
      return await this.taskRepository.save(task);
    } catch (e) {
      return e;
    }
  }

  async findAllTasksForUser(userId: number) {
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
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, ability: PureAbility) {
    return { id, updateTaskDto, ability };
  }

  async remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
