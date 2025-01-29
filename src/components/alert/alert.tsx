import { Alert as MantineAlert, Center } from "@mantine/core";
import { FC } from "react";
import * as Icons from "@assets/icons";

type TAlert = {
  type: "error" | "warning" | "info";
  message: string;
};

export const Alert: FC<TAlert> = ({ type, message }) => {
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
    info: "blue",
  }[type];

  return (
    <Center>
      <MantineAlert variant="light" color={color} title={title} icon={icon}>
        {message}
      </MantineAlert>
    </Center>
  );
};

export default Alert;
