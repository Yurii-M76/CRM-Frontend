import { TDistrict, TProject } from ".";

export type TPerson = {
  id: string;
  surname: string;
  name: string;
  patronymic: string;
  birthday: Date;
  phone: string;
  email: string;
  roles: TPersonRoles;
  districts: TDistrict[];
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
