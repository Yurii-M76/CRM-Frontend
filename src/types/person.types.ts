import { TProject } from ".";

export type TPerson = {
  id: string;
  surname: string;
  name: string;
  patronymic: string;
  birthday: string;
  phone: string;
  email: string;
  rating: number;
  projects: TProject[];
  createdAt: Date;
  updatedAt: Date;
};
