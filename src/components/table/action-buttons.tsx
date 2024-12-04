import { IconEdit, IconTrash } from "@tabler/icons-react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { FC } from "react";
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
    <div className={classes.action_buttons}>
      <Tooltip label="Редактировать">
        <ActionIcon
          aria-label="Редактировать"
          variant="light"
          radius="xl"
          color="orange"
          onClick={handleClickFromEdit}
        >
          <IconEdit style={{ width: "20px", height: "20px" }} stroke={1} />
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
          <IconTrash style={{ width: "20px", height: "20px" }} stroke={1} />
        </ActionIcon>
      </Tooltip>
    </div>
  );
};
