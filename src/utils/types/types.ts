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

export enum UserRoleRequest {
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

// Определяем enum для полей, которые хотим выбрать
enum UserSelectFields {
  ID = 'id',
  PASSWORD = 'password',
  LOGIN = 'login',
  ROLE = 'role',
  FIRSTNAME = 'firstName',
  LASTNAME = 'lastName',
  MIDDLENAME = 'middleName',
  ACCESSTOKEN = 'accessToken',
  REFRESHTOKEN = 'refreshToken',
  MANAGER = 'manager',
  SUBORDINATES = 'subordinates',
  TASKSCREATED = 'tasksCreated',
  TASKSASSIGNED = 'tasksAssigned',
}

// Теперь можно использовать значения из enum для указания полей в select
export const UserSelectAllFields: UserSelectFields[] = [
  UserSelectFields.ID,
  UserSelectFields.PASSWORD,
  UserSelectFields.LOGIN,
  UserSelectFields.ROLE,
  UserSelectFields.FIRSTNAME,
  UserSelectFields.LASTNAME,
  UserSelectFields.MIDDLENAME,
  UserSelectFields.ACCESSTOKEN,
  UserSelectFields.REFRESHTOKEN,
  UserSelectFields.SUBORDINATES,
  UserSelectFields.TASKSCREATED,
  UserSelectFields.TASKSASSIGNED,
];
