import { User } from 'src/users/entities/user.entity';

interface TUserDB extends User {
  id: number;
}

export type TJwtRequest = { user: TUserDB };

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export enum UserRole {
  SUPERADMIN = 'superadmin',
  MANAGER = 'manager',
  SUBORDINATE = 'subordinate',
}
