import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { EntityBoilerplate } from 'src/utils/entityBoilerplate';

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
    enum: ['high', 'medium', 'low'],
  })
  priority: 'high' | 'medium' | 'low';

  @Column({
    type: 'enum',
    enum: ['to_do', 'in_progress', 'done', 'cancelled'],
  })
  status: 'to_do' | 'in_progress' | 'done' | 'cancelled';

  @ManyToOne(() => User, (user) => user.tasksCreated)
  creator: User;

  @ManyToOne(() => User, (user) => user.tasksAssigned)
  assignee: User;
}
