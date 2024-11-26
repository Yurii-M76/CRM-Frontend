import { TVolunteer } from ".";

export type TProject = {
  id: string;
  title: string;
  describe: string;
  volunteers: TVolunteer[];
  createdAt: Date;
  updatedAt: Date;
};