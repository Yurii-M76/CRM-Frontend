import { Button, ButtonGroup, CloseButton, Input } from "@mantine/core";
import {
  IconDownload,
  IconFilter,
  IconPlus,
  IconUpload,
} from "@tabler/icons-react";
import { Form } from "react-router-dom";
import classes from "./control-panel.module.css";
import { FC } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "../../modal/modal";
import { AddForm } from "../add-form/add-form";

type TControlPanel = {
  searchValue: string;
  setSearchValue: (str: string) => void;
};

export const ControlPanel: FC<TControlPanel> = ({
  searchValue,
  setSearchValue,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const handleClearSearchForm = () => {
    setSearchValue("");
  };

  return (
    <div className={classes.control}>
      <div className={classes.control_left}>
        <Modal
          title="Новая запись"
          close={close}
          open={open}
          opened={opened}
        >
          <AddForm />
        </Modal>
        <ButtonGroup>
          <Button
            variant="default"
            onClick={open}
            leftSection={<IconPlus size={14} />}
          >
            Добавить
          </Button>
          <Button variant="default" rightSection={<IconUpload size={14} />}>
            Загрузить
          </Button>
          <Button variant="default" rightSection={<IconDownload size={14} />}>
            Скачать
          </Button>
        </ButtonGroup>
        <Form>
          <Input
            placeholder="Найти..."
            miw="340px"
            value={searchValue}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
            rightSectionPointerEvents="all"
            rightSection={
              <CloseButton
                aria-label="Поиск"
                onClick={handleClearSearchForm}
                style={{ display: searchValue ? undefined : "none" }}
              />
            }
          />
        </Form>
      </div>
      <Button variant="default" rightSection={<IconFilter size={14} />}>
        Фильтры
      </Button>
    </div>
  );
};
