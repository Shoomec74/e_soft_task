import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ProgressTask } from 'src/utils/types/types';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsEnum(ProgressTask)
  @IsOptional()
  status: ProgressTask;
}
