export type TUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  isBlocked: boolean;
};

export enum UserRole {
  READER = "Только чтение",
  USER = "Пользователь",
  ADMIN = "Администратор",
}
