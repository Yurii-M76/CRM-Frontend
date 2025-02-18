import { Alert as MantineAlert, Center, Divider } from "@mantine/core";
import { FC, ReactNode } from "react";
import * as Icons from "@assets/icons";

type TAlert = {
  type: "error" | "warning" | "info";
  message: string;
  variant?: "default" | "filled" | "light" | "outline";
  disabledTitle?: boolean;
  disabledIcon?: boolean;
  children?: ReactNode;
};

export const Alert: FC<TAlert> = ({
  type,
  message,
  variant = "light",
  disabledTitle,
  disabledIcon,
  children,
}) => {
  const title = {
    error: "Ошибка",
    warning: "Предупреждение",
    info: "Информация",
  }[type];

  const icon =
    type === "error" ? (
      <Icons.IconXboxX strokeWidth={2} />
    ) : type === "warning" ? (
      <Icons.IconWarningCircle strokeWidth={2} />
    ) : (
      <Icons.IconInfoCircle strokeWidth={2} />
    );

  const color = {
    error: "red",
    warning: "orange",
    info: "gray",
  }[type];

  return (
    <Center>
      <MantineAlert
        variant={variant}
        color={color}
        title={!disabledTitle && title}
        icon={!disabledIcon && icon}
        w="100%"
      >
        {message}
        {children && <Divider mt={10} mb={10} />}
        {children}
      </MantineAlert>
    </Center>
  );
};

export default Alert;
