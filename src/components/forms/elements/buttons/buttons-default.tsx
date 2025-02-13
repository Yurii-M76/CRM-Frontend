import { Button, Group } from "@mantine/core";
import { FC } from "react";

type TButtonsDefaultFromForm = {
  loading?: boolean;
  saveButtonLabel?: string;
  onClick?: () => void;
  onClose?: () => void;
};

const ButtonsDefaultFromForm: FC<TButtonsDefaultFromForm> = ({
  loading,
  saveButtonLabel = "Сохранить",
  onClick,
  onClose,
}) => {
  return (
    <Group mt="lg" justify="flex-end" gap={8}>
      <Button
        variant="subtle"
        color="gray"
        disabled={loading}
        onClick={onClose}
      >
        Отменить
      </Button>
      <Button
        variant="filled"
        color="green"
        type="submit"
        loading={loading}
        onClick={onClick}
      >
        {saveButtonLabel}
      </Button>
    </Group>
  );
};

export default ButtonsDefaultFromForm;
