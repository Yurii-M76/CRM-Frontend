import { ActionIcon, Tooltip } from "@mantine/core";
import { FC } from "react";
import * as Icons from "../../assets/icons";
import classes from "@components/table/table.module.css";

type TActionButtons = {
  handleClickFromEdit: () => void;
  handleClickFromDelete: () => void;
};

export const ActionButtons: FC<TActionButtons> = ({
  handleClickFromEdit,
  handleClickFromDelete,
}) => {
  return (
    <div className={classes.actionButtons}>
      <Tooltip label="Редактировать">
        <ActionIcon
          aria-label="Редактировать"
          variant="light"
          radius="xl"
          color="orange"
          onClick={handleClickFromEdit}
        >
          <Icons.IconEdit className={classes.iconActionButtons} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Удалить">
        <ActionIcon
          aria-label="Удалить"
          variant="light"
          radius="xl"
          color="red"
          onClick={handleClickFromDelete}
        >
          <Icons.IconTrash className={classes.iconActionButtons} />
        </ActionIcon>
      </Tooltip>
    </div>
  );
};
