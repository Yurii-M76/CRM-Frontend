import { Button, Group } from "@mantine/core";
import { FC } from "react";

type TButtonsDefaultFromForm = {
  loading?: boolean;
  onClose?: () => void;
};

const ButtonsDefaultFromForm: FC<TButtonsDefaultFromForm> = ({
  loading,
  onClose,
}) => {
  return (
    <Group mt="lg" justify="flex-end">
      <Button
        variant="default"
        color="gray"
        disabled={loading}
        onClick={onClose}
      >
        Отменить
      </Button>
      <Button variant="filled" color="green" type="submit" loading={loading}>
        Сохранить
      </Button>
    </Group>
  );
};

export default ButtonsDefaultFromForm;
