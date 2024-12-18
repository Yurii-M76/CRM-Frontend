import { Button, ButtonGroup } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC, lazy } from "react";
import { Search } from "@/components/search/search";
import { resetSearch, setSearch } from "@/services/project/reducer";
import * as Icons from "../../assets/icons";
const Modal = lazy(() => import("@/components/modal/modal"));
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
              leftSection={<Icons.IconPlus className={classes.icon} />}
              onClick={open}
              disabled={isLoading}
            >
              Добавить
            </Button>
            <Button
              variant="default"
              rightSection={<Icons.IconDownload className={classes.icon} />}
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
