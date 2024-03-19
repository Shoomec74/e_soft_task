import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { EntityBoilerplate } from 'src/utils/entityBoilerplate';
import { PriorityTask, ProgressTask } from 'src/utils/types/types';

@Entity()
export class Task extends EntityBoilerplate {
  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  deadline: Date;

  @Column({
    type: 'enum',
    enum: PriorityTask,
  })
  priority: PriorityTask;

  @Column({
    type: 'enum',
    enum: ProgressTask,
    default: ProgressTask.TODO,
  })
  status: ProgressTask;

  @ManyToOne(() => User, (user) => user.tasksCreated)
  creator: User;

  @ManyToOne(() => User, (user) => user.tasksAssigned)
  assignee: User;
}
