export type TUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  isBlocked: boolean;
};
