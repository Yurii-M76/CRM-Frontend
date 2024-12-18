import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import * as Icons from "../../assets/icons";
import classes from "./color-sheme-toggle.module.css";

export const ColorSchemeToggle = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      variant="default"
      size="lg"
      aria-label="Toggle color scheme"
    >
      {colorScheme === "light" ? (
        <Icons.IconMoon className={classes.icon} />
      ) : (
        <Icons.IconSun className={classes.icon} />
      )}
    </ActionIcon>
  );
};
