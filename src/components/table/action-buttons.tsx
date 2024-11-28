import { IconEdit, IconTrash } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";
import classes from "@components/table/table.module.css";

export const ActionButtons = () => {
  return (
    <div className={classes.action_buttons}>
      <ActionIcon aria-label="Edit" variant="light" radius="xl" color="orange">
        <IconEdit style={{ width: "20px", height: "20px" }} stroke={1} />
      </ActionIcon>
      <ActionIcon aria-label="Delete" variant="light" radius="xl" color="red">
        <IconTrash style={{ width: "20px", height: "20px" }} stroke={1} />
      </ActionIcon>
    </div>
  );
};
