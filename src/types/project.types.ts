import { TDistrict, TPerson } from ".";

export type TCalendar = "default" | "range" | "multiple" | "undefined";

export type TProject = {
  id: string;
  title: string;
  calendar: TCalendar;
  dates: Date[];
  description: string;
  districts: TDistrict[];
  persons: TPerson[];
  note: string;
  createdAt: Date;
};
