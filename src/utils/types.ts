export type TUser = {
  id: string;
  name: string;
  email: string;
  roles: string;
};

export type TVolunteer = {
  id: string;
  surname: string;
  name: string;
  patronymic: string;
  birthday: string;
  phone: string;
  email: string;
  rating: number;
  projects: JSON;
  createdAt: Date;
  updatedAt: Date;
};