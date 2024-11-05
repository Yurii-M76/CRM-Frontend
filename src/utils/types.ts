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
  phone: string;
  email: string;
  rating: number;
  projects: string[];
  createdAt: Date;
  updatedAt: Date;
};