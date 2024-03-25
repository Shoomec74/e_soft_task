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
  @CreateDateColumn({ type: 'timestamptz', select: false })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updatedAt: Date;
}
