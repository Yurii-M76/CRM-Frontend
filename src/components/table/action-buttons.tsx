import { ActionIcon } from "@mantine/core";
import { FC } from "react";
import * as Icons from "@assets/icons";
import classes from "@components/table/table.module.css";

type TActionButtons = {
  handleClickFromEdit: () => void;
  handleClickFromDelete: () => void;
  disabledEditButton?: boolean;
  disabledDeleteButton?: boolean;
};

const ActionButtons: FC<TActionButtons> = ({
  handleClickFromEdit,
  handleClickFromDelete,
  disabledEditButton,
  disabledDeleteButton,
}) => {
  return (
    <div className={classes.actionButtons}>
      <ActionIcon
        aria-label="Редактировать"
        variant="light"
        radius="xl"
        color="orange"
        onClick={handleClickFromEdit}
        disabled={disabledEditButton}
      >
        <Icons.IconEdit className={classes.iconActionButtons} />
      </ActionIcon>
      <ActionIcon
        aria-label="Удалить"
        variant="light"
        radius="xl"
        color="red"
        onClick={handleClickFromDelete}
        disabled={disabledDeleteButton}
      >
        <Icons.IconTrash className={classes.iconActionButtons} />
      </ActionIcon>
    </div>
  );
};

export default ActionButtons;
