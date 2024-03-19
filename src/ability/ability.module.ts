import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AbilityFactory],
  exports: [AbilityFactory],
})
export class AbilityModule {}
