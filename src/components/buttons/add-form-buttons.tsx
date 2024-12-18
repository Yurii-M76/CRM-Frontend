import { Button, Group } from "@mantine/core";
import { FC } from "react";

type TFormButtons = {
  loading?: boolean;
  onClose?: () => void;
};

export const FormButtons: FC<TFormButtons> = ({ loading, onClose }) => {
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
