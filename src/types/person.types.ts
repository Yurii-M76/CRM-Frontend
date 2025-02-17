import { TDistrict, TProject } from ".";

export type TPerson = {
  id: string;
  surname: string;
  name: string;
  patronymic: string;
  fullName: string;
  birthday: string | Date | null;
  phone: string;
  email: string;
  roles: string[];
  districts: TDistrict[];
  projects: TProject[];
  car: string;
  organization: string;
  note: string;
  createdAt: Date;
};

// export type TPersonRoles = (keyof typeof Role)[]; // массив ключей Role

export enum Role {
  VOLUNTEER = "Волонтер",
  DRIVER = "Водитель",
  DELEGATE = "Представитель",
}

export interface TPersonsFilters
  extends Omit<TPerson, "id" | "fullName" | "createdAt"> {
  isNotEmptySurname: boolean;
  isNotEmptyPatronymic: boolean;
  isNotEmptyBirthday: boolean;
  isNotEmptyPhone: boolean;
  isNotEmptyEmail: boolean;
  isNotEmptyRoles: boolean;
  isNotEmptyProjects: boolean;
  isNotEmptyCar: boolean;
  isNotEmptyOrganization: boolean;
  isNotEmptyNote: boolean;
  isEmptySurname: boolean;
  isEmptyPatronymic: boolean;
  isEmptyBirthday: boolean;
  isEmptyPhone: boolean;
  isEmptyEmail: boolean;
  isEmptyRoles: boolean;
  isEmptyProjects: boolean;
  isEmptyCar: boolean;
  isEmptyOrganization: boolean;
  isEmptyNote: boolean;
}

export enum fieldNames {
  surname = "Фамилия",
  name = "Имя",
  patronymic = "Отчество",
  birthday = "Дата рождения",
  phone = "Телефон",
  email = "Email",
  districts = "Район",
  roles = "Роль",
  projects = "Проекты",
  car = "Автомобиль",
  organization = "Органиция",
  note = "Примечание",
}