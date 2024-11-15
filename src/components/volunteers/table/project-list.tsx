import { Badge } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { FC } from "react";
import { TProjectList } from "../types";
import classes from "./project-list.module.css";

type ProjectList = {
  data: JSON;
};

// FIXME: Обработать ошибку пустого JSON (если отсутствуют проекты)
// FIXME: Заменить randomId() в списке проектов на id проекта

export const ProjectList: FC<ProjectList> = ({ data }) => {
  const list: TProjectList[] = JSON.parse(String(data));
  return (
    <ul className={classes.projects_list}>
      {list.map((item) => {
        return (
          <li key={randomId()}>
            <Badge variant="default" color="gray">
              {item.name}
            </Badge>
          </li>
        );
      })}
    </ul>
  );
};
