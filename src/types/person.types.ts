import { TProject } from "./project.types";

export type TPerson = {
  id: string;
  surname: string;
  name: string;
  patronymic: string;
  birthday: string;
  phone: string;
  email: string;
  roles: TPersonRoles;
  projects: TProject[];
  createdAt: Date;
  updatedAt: Date;
};

export type TPersonRoles = (keyof typeof Role)[]; // массив ключей Role

export enum Role {
  GUEST = "Участник",
  VOLUNTEER = "Волонтер",
  DRIVER = "Водитель",
  DELEGATE = "Представитель",
}
