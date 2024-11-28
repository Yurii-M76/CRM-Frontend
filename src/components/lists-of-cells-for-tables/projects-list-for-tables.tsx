import { Pill } from "@mantine/core";
import { FC } from "react";
import { TProject } from "@/types";
import classes from "../table/table.module.css";

type TProjects = {
  data: TProject[];
};

export const ProjectsListForTables: FC<TProjects> = ({ data }) => {
  const projects = data.map((item) => {
    return (
      <li key={item.id}>
        <Pill size="md">{item.title}</Pill>
      </li>
    );
  });
  return <ul className={classes.projects_list_for_table}>{projects}</ul>;
};
