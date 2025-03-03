import { Column, TPerson } from "@/types";

export const columnsToPersonsTable: Column<TPerson>[] = [
  { label: "ФИО", accessor: "fullName", size: 200, sorted: true },
  { label: "Телефон", accessor: "phone", size: 180, sorted: true },
  { label: "Дата рождения", accessor: "birthday", size: 180, sorted: true },
  { label: "E-Mail", accessor: "email", size: 180, sorted: true },
  { label: "Роль", accessor: "roles", size: 140, sorted: false },
  { label: "Проекты", accessor: "projects", size: 260, sorted: true },
  { label: "Район", accessor: "districts", size: 240, sorted: true },
];

export const columnsToUploadData = [
  { header: "Фамилия", key: "surname", width: 15 },
  { header: "Имя", key: "name", width: 15 },
  { header: "Отчество", key: "patronymic", width: 15 },
  { header: "Дата рождения", key: "birthday", width: 12 },
  { header: "Телефон", key: "phone", width: 15 },
  { header: "Email", key: "email", width: 20 },
  { header: "Роль", key: "roles", width: 20 },
  { header: "Район", key: "districts", width: 25 },
  { header: "Проекты", key: "projects", width: 30 },
  { header: "Автомобиль", key: "car", width: 15 },
  { header: "Организация", key: "organization", width: 20 },
  { header: "Примечание", key: "note", width: 30 },
];