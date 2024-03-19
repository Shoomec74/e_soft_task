import { Exclude } from 'class-transformer';
import { Task } from 'src/tasks/entities/task.entity';
import { EntityBoilerplate } from 'src/utils/entityBoilerplate';
import { UserRole } from 'src/utils/types/types';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class User extends EntityBoilerplate {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
  @Column({ unique: true })
  login: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SUBORDINATE,
  })
  role: UserRole;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @ManyToOne(() => User, (user) => user.subordinates)
  manager: User;

  @OneToMany(() => User, (user) => user.manager)
  subordinates: User[];

  @OneToMany(() => Task, (task) => task.creator)
  tasksCreated: Task[];

  @OneToMany(() => Task, (task) => task.assignee)
  tasksAssigned: Task[];
}
