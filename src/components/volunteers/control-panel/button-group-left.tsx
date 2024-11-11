import { Button, ButtonGroup } from "@mantine/core";
import { IconDownload, IconPlus, IconUpload } from "@tabler/icons-react";

export const ButtonGroupLeft = () => {
  return (
    <ButtonGroup>
      <Button
        variant="default"
        // onClick={open}
        leftSection={<IconPlus size={14} />}
      >
        Добавить
      </Button>
      <Button
        variant="default"
        rightSection={<IconUpload size={14} />}
        disabled
      >
        Загрузить
      </Button>
      <Button
        variant="default"
        rightSection={<IconDownload size={14} />}
        disabled
      >
        Скачать
      </Button>
    </ButtonGroup>
  );
};
