import { TPerson } from ".";

export type TProject = {
  id: string;
  title: string;
  describe: string;
  persons: TPerson[];
  createdAt: Date;
};