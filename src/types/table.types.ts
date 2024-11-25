import { TVolunteer } from ".";

export type Column = {
  label: string;
  accessor: keyof TVolunteer;
  sorted: boolean;
};