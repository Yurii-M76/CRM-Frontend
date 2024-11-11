import { TVolunteer } from "@/utils/types";

export type Column = {
  label: string;
  accessor: keyof TVolunteer;
  sorted: boolean;
};

export type TProjectList = {
  id: string;
  name: string;
};