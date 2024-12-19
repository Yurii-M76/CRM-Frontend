import { Modal as MantineModal } from "@mantine/core";
import { FC, ReactNode } from "react";

type TModal = {
  opened: boolean;
  close: () => void;
  closeButton?: boolean | true;
  title?: string;
  size?: "lg" | "md" | "sm" | "xl" | "xs";
  centered?: boolean;
  position?: "top" | "center";
  children: ReactNode;
};

const Modal: FC<TModal> = ({
  opened,
  close,
  closeButton,
  title,
  size,
  centered,
  children,
}) => {
  return (
    <MantineModal
      opened={opened}
      onClose={close}
      withCloseButton={closeButton}
      centered={centered}
      title={title}
      size={size ? size : "md"}
    >
      {children}
    </MantineModal>
  );
};

export default Modal;