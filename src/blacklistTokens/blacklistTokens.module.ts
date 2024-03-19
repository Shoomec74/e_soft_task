import { Module } from '@nestjs/common';
import { BlacklistTokensService } from './blacklistTokens.service';
import { BlacklistTokensController } from './blacklistTokens.controller';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlacklistTokens } from './entities/blacklistTokens.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlacklistTokens])],
  controllers: [BlacklistTokensController],
  providers: [BlacklistTokensService, JwtService],
  exports: [BlacklistTokensService],
})
export class BlacklistTokensModule {}
