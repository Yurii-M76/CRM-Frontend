import { Button, ButtonGroup } from "@mantine/core";
import {
  IconDownload,
  IconFilter,
  IconPlus,
  IconUpload,
} from "@tabler/icons-react";
import classes from "./head.module.css";
import { Search } from "./search";

export const Head = () => {
  return (
    <div className={classes.head}>
      <div className={classes.left}>
        <ButtonGroup>
          <Button
            variant="light"
            color="green"
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
        <Search />
      </div>
      <div>
        <Button
          variant="default"
          rightSection={<IconFilter size={14} />}
          disabled
        >
          Фильтры
        </Button>
      </div>
    </div>
  );
};
