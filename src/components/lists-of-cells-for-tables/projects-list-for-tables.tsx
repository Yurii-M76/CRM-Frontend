import { Badge } from "@mantine/core";
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
        <Badge variant="default" color="gray">
          {item.title}
        </Badge>
      </li>
    );
  });
  return <ul className={classes.badges_list}>{projects}</ul>;
};
