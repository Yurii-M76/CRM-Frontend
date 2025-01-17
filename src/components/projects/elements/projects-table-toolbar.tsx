import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC } from "react";
import { Modal } from "@components";
import { Search } from "@components/forms";
import { resetSearch, setSearch } from "@/services/project/reducer";
import * as Icons from "@assets/icons";
import classes from "../../table/table.module.css";

type TProjectsTableToolbar = {
  isLoading: boolean;
  isDisabled: boolean;
};

const ProjectsTableToolbar: FC<TProjectsTableToolbar> = ({
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
          <Button.Group>
            <Button
              variant="light"
              color="green"
              leftSection={<Icons.IconPlus className={classes.icon} />}
              onClick={open}
              disabled={isLoading}
              m={0}
            >
              Добавить
            </Button>
            <Button
              variant="default"
              rightSection={<Icons.IconDownload className={classes.icon} />}
              disabled
              m={0}
            >
              Скачать
            </Button>
          </Button.Group>
          <Search
            query={setSearch}
            reset={resetSearch}
            isDisabled={isDisabled}
          />
        </div>
        <div className={classes.flexGroup}>
          <Button
            variant="default"
            rightSection={<Icons.IconFliter className={classes.icon} />}
            disabled
          >
            Фильтры
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProjectsTableToolbar;