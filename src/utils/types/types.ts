import { PureAbility } from '@casl/ability';
import { User } from 'src/users/entities/user.entity';

interface TUserDB extends User {
  id: number;
}

export type TJwtRequest = { user: TUserDB; ability?: PureAbility };

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export enum UserRole {
  SUPERADMIN = 'superadmin',
  MANAGER = 'manager',
  SUBORDINATE = 'subordinate',
}

export enum ProgressTask {
  TODO = 'to_do',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

export enum PriorityTask {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}
