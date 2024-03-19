import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { STRTAGIES } from './strategies';
import { GUARDS } from './guards';
import { JwtModule } from '@nestjs/jwt';
import { jwtOptions } from 'src/configs/jwt.config';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { AbilityModule } from 'src/ability/ability.module';
import { BlacklistTokensModule } from 'src/blacklistTokens/blacklistTokens.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync(jwtOptions()),
    TypeOrmModule.forFeature([User]),
    AbilityModule,
    BlacklistTokensModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ...STRTAGIES, ...GUARDS],
})
export class AuthModule {}
