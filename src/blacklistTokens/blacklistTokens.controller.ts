import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { BlacklistTokensService } from './blacklistTokens.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';

@UseGuards(JwtGuard)
@ApiTags('logout')
@Controller('logout')
export class BlacklistTokensController {
  constructor(
    private readonly blacklistTokensService: BlacklistTokensService,
  ) {}

  @Get()
  async addToken(
    @Headers('authorization') authHeader: string,
  ): Promise<Record<string, string>> {
    const token = authHeader.split(' ')[1];
    await this.blacklistTokensService.addToken(token);
    return { message: 'User logout' };
  }
}
