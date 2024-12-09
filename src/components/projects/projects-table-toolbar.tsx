import { Button, ButtonGroup } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDownload, IconFilter, IconPlus } from "@tabler/icons-react";
import { Search } from "@/components/search/search";
import { resetSearch, setSearch } from "@/services/project/reducer";
import { Modal } from "../modal/modal";
import { FC } from "react";
import classes from "../table/table.module.css";

type TProjectsTableToolbar = {
  isLoading: boolean;
  isDisabled: boolean;
};

export const ProjectsTableToolbar: FC<TProjectsTableToolbar> = ({
  isLoading,
  isDisabled,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal title="Добавить проект" opened={opened} close={close} size="lg">
        form
      </Modal>
      <div className={classes.tableToolbar}>
        <div className={classes.flexGroup}>
          <ButtonGroup>
            <Button
              variant="light"
              color="green"
              leftSection={<IconPlus size={14} />}
              onClick={open}
              disabled={isLoading}
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
          <Search
            query={setSearch}
            reset={resetSearch}
            isDisabled={isDisabled}
          />
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
