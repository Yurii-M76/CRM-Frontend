import { Badge } from "@mantine/core";
import { TProjectList } from "../types";
import { FC } from "react";
import classes from "./volunteers-table.module.css";

type ProjectList = {
  data: JSON;
};

// FIXME: Обработать ошибку пустого JSON (если отсутствуют проекты)

export const ProjectList: FC<ProjectList> = ({ data }) => {
  const list: TProjectList[] = JSON.parse(String(data));
  return (
    <ul className={classes.projects_list}>
      {list.map((item) => {
        return (
          <li key={item.id}>
            <Badge variant="default" color="gray">
              {item.name}
            </Badge>
          </li>
        );
      })}
    </ul>
  );
};
