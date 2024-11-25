import { Badge } from "@mantine/core";
import { FC } from "react";
import classes from "./project-list.module.css";
import { TProject } from "@/types";

type TProjects = {
  data: TProject[];
};

export const ProjectList: FC<TProjects> = ({ data }) => {
  const projects = data.map((item) => {
    return (
      <li key={item.id}>
        <Badge variant="default" color="gray">
          {item.title}
        </Badge>
      </li>
    );
  });
  return <ul className={classes.projects_list}>{projects}</ul>;
};
