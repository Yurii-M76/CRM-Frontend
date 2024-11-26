import { Modal as MantineModal, Text } from "@mantine/core";
import { FC, ReactNode } from "react";

type TModal = {
  opened: boolean;
  close: () => void;
  title: string;
  size?: "lg" | "md" | "sm" | "xl" | "xs";
  centered?: boolean;
  position?: "top" | "center";
  children: ReactNode;
};

export const Modal: FC<TModal> = ({
  opened,
  close,
  title,
  size,
  centered,
  children,
}) => {
  return (
    <MantineModal
      opened={opened}
      onClose={close}
      centered={centered}
      title={
        <Text
          fw={700}
          variant="gradient"
          gradient={{ from: "blue", to: "cyan", deg: 90 }}
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
