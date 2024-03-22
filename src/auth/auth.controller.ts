import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/localAuth.guard';
import { ITokens, TJwtRequest } from 'src/utils/types/types';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req: TJwtRequest): Promise<User> {
    return this.authService.auth(req.user.id);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<ITokens> {
    return this.authService.refreshToken(refreshToken);
  }
}
