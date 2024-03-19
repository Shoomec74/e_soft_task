import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class EntityBoilerplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @CreateDateColumn({ select: false })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
