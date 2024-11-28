import { Anchor, Badge, Tooltip } from "@mantine/core";
import { FC, useState } from "react";
import { TVolunteer } from "@/types";
import classes from "../table/table.module.css";

type TData = {
  data: TVolunteer[];
};

export const VolunteersListForTables: FC<TData> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const list = data.map((item) => {
    return (
      <li key={item.id}>
        {item.surname + " " + item.name + " " + item.patronymic}
      </li>
    );
  });
  return (
    <div className={classes.spoiler} style={{ position: "relative" }}>
      {!isOpen ? (
        <div className={classes.count_badge}>
          <Tooltip label="Количество волонтеров">
            <Badge size="lg" variant="light" color="gray" circle>
              {list.length}
            </Badge>
          </Tooltip>
        </div>
      ) : null}
      <div className={!isOpen ? classes.spoiler_close : classes.spoiler_open}>
        <ul className={classes.list}>{list}</ul>
      </div>
      {list.length > 3 ? (
        <Anchor size="sm" onClick={() => setIsOpen(!isOpen)}>
          {!isOpen ? "[развернуть]" : "[свернуть]"}
        </Anchor>
      ) : null}
    </div>
  );
};
