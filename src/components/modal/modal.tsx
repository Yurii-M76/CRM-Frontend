import { Modal as MantineModal, Text } from "@mantine/core";
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

export const Modal: FC<TModal> = ({
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
      title={
        <Text
          fw={700}
          variant="gradient"
          gradient={{ from: "blue", to: "cyan", deg: 90 }}
          size="1.05rem"
        >
          {title}
        </Text>
      }
      size={size ? size : "md"}
    >
      {children}
    </MantineModal>
  );
};
