import { Button, ButtonGroup } from "@mantine/core";
import {
  IconDownload,
  IconFilter,
  IconPlus,
  IconUpload,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { AddForm } from "../add-form/add-form";
import { Search } from "@/components/search/search";
import { resetSearch, setSearch } from "@/services/volunteer/reducer";
import { Modal } from "@/components/modal/modal";
import { FC } from "react";
import classes from "@components/table/table.module.css";

type TVolunteersTableToolbar = {
  isDisabled: boolean;
};

export const VolunteersTableToolbar: FC<TVolunteersTableToolbar> = ({
  isDisabled,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const modal = (
    <Modal title="Добавить волонтера" opened={opened} close={close} size="lg">
      <AddForm />
    </Modal>
  );
  return (
    <>
      <div className={classes.table_toolbar}>
        <div className={classes.flexGroup}>
          <ButtonGroup>
            <Button
              variant="light"
              color="green"
              leftSection={<IconPlus size={14} />}
              onClick={open}
              disabled={isDisabled}
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
          <Search query={setSearch} reset={resetSearch} isDisabled={isDisabled} />
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
      {modal}
    </>
  );
};
