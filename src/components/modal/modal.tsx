import { Modal as ModalMantine, Title } from "@mantine/core";
import { FC, ReactNode } from "react";

type ModalProps = {
  title: string;
  open: () => void;
  close: () => void;
  opened: boolean;
  children?: ReactNode;
};

export const Modal: FC<ModalProps> = ({ title, close, opened, children }) => {
  return (
    <>
      <ModalMantine
        opened={opened}
        onClose={close}
        title={<Title order={4}>{title}</Title>}
        size="lg"
        overlayProps={{
          backgroundOpacity: 0.55,
        }}
        padding={20}
        // centered
      >
        {children}
      </ModalMantine>
    </>
  );
};
