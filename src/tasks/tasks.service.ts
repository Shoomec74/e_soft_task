import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
