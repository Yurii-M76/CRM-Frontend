import { Button, ButtonGroup } from "@mantine/core";
import { IconDownload, IconFilter, IconPlus } from "@tabler/icons-react";
import { Search } from "@/components/search/search";
import { resetSearch, setSearch } from "@/services/volunteer/reducer";
import { Modal } from "../modal/modal";
import { useDisclosure } from "@mantine/hooks";
import classes from "../table/table.module.css";

export const ProjectsTableToolbar = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal title="Добавить проект" opened={opened} close={close} size="lg">
        form
      </Modal>
      <div className={classes.table_toolbar}>
        <div className={classes.flexGroup}>
          <ButtonGroup>
            <Button
              variant="light"
              color="green"
              leftSection={<IconPlus size={14} />}
              onClick={open}
            >
              Добавить
            </Button>
            <Button
              variant="default"
              rightSection={<IconDownload size={14} />}
              disabled
            >
              Скачать
            </Button>
          </ButtonGroup>
          <Search query={setSearch} reset={resetSearch} />
        </div>
        <div className={classes.flexGroup}>
          <Button
            variant="default"
            rightSection={<IconFilter size={14} />}
            disabled
          >
            Фильтры
          </Button>
        </div>
      </div>
    </>
  );
};
