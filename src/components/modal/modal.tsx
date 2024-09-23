import { useDisclosure } from "@mantine/hooks";
import { Modal as ModalMantine, Button } from "@mantine/core";
import { FC } from "react";

type ModalProps = object;

export const Modal: FC<ModalProps> = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <ModalMantine
        opened={opened}
        onClose={close}
        title="ModalName"
        size="lg"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        centered
      >
        Контент
      </ModalMantine>

      <Button onClick={open}>Показать</Button>
    </>
  );
};
