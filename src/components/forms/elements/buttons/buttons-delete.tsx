import { Button, Group } from "@mantine/core";
import { FC } from "react";

type TButtonsFromDeleteForm = {
  onClickToCancel: () => void;
  onClickToDelete: () => void;
  loading: boolean;
};

const ButtonsFromDeleteForm: FC<TButtonsFromDeleteForm> = ({
  onClickToCancel,
  onClickToDelete,
  loading,
}) => {
  return (
    <Group mt="lg" justify="flex-end" gap={8}>
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

export default ButtonsFromDeleteForm;