import { AbilityGuard } from './ability.guard';
import { JwtGuard } from './jwtAuth.guards';
import { LocalGuard } from './localAuth.guard';

export const GUARDS = [LocalGuard, JwtGuard, AbilityGuard];
