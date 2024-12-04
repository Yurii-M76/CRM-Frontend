import { Button, Group } from "@mantine/core";
import { FC } from "react";

type TDeleteModalButtons = {
  onClickToCancel: () => void;
  onClickToDelete: () => void;
  loading: boolean;
};

export const DeleteModalButtons: FC<TDeleteModalButtons> = ({
  onClickToCancel,
  onClickToDelete,
  loading,
}) => {
  return (
    <Group mt="lg" justify="flex-end">
      <Button
        variant="default"
        color="gray"
        onClick={onClickToCancel}
        disabled={loading}
      >
        Отменить
      </Button>
      <Button
        variant="filled"
        color="red"
        onClick={onClickToDelete}
        loading={loading}
      >
        Удалить
      </Button>
    </Group>
  );
};
