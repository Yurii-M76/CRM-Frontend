import { IconEdit, IconTrash } from "@tabler/icons-react";
import { ActionIcon, Tooltip } from "@mantine/core";
import classes from "@components/table/table.module.css";

export const ActionButtons = () => {
  return (
    <div className={classes.action_buttons}>
      <Tooltip label="Редактировать">
        <ActionIcon
          aria-label="Редактировать"
          variant="light"
          radius="xl"
          color="orange"
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
        >
          <IconTrash style={{ width: "20px", height: "20px" }} stroke={1} />
        </ActionIcon>
      </Tooltip>
    </div>
  );
};
