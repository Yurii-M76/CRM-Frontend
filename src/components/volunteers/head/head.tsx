import { Button, ButtonGroup, Modal, Text } from "@mantine/core";
import {
  IconDownload,
  IconFilter,
  IconPlus,
  IconUpload,
} from "@tabler/icons-react";
import { Search } from "./search";
import classes from "./head.module.css";
import { useDisclosure } from "@mantine/hooks";
import { AddForm } from "../add-form/add-form";

export const Head = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text
            fw={700}
            variant="gradient"
            gradient={{ from: "blue", to: "cyan", deg: 90 }}
          >
            Добавить волонтера
          </Text>
        }
        size="lg"
      >
        <AddForm />
      </Modal>

      <div className={classes.head}>
        <div className={classes.left}>
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
    </>
  );
};
