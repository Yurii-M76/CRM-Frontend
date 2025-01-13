export type TUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  isBlocked: boolean;
};

export type TUsers = {
  items: TUser[]
}