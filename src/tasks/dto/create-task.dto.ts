import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PriorityTask } from 'src/utils/types/types';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsDateString()
  deadline: Date;

  @IsEnum(PriorityTask)
  priority: PriorityTask;

  @IsOptional()
  @IsNotEmpty()
  assigneeId?: number;
}
