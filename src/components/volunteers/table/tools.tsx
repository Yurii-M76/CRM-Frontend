import { IconEdit, IconTrash } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";
import classes from "./volunteers-table.module.css";

export const Tools = () => {
  return (
    <div className={classes.tools}>
      <ActionIcon aria-label="Edit" variant="light" radius="xl" color="orange">
        <IconEdit style={{ width: "20px", height: "20px" }} stroke={1} />
      </ActionIcon>
      <ActionIcon aria-label="Delete" variant="light" radius="xl" color="red">
        <IconTrash style={{ width: "20px", height: "20px" }} stroke={1} />
      </ActionIcon>
    </div>
  );
};
