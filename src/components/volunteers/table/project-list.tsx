import { Badge } from "@mantine/core";
import { TProjectList } from "../types";
import { FC } from "react";
import classes from "./volunteers-table.module.css";
import { randomId } from "@mantine/hooks";

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
