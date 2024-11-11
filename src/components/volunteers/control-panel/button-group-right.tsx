import { Button } from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";

export const ButtonGroupRight = () => {
  return (
    <Button variant="default" rightSection={<IconFilter size={14} />} disabled>
      Фильтры
    </Button>
  );
};
