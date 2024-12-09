import { Loader as MantineLoader } from "@mantine/core";
import classes from "./loader.module.css";

export const Loader = () => {
  return (
    <div className={classes.loader}>
      <MantineLoader size={26} />
    </div>
  );
};
