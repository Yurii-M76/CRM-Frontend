import { Loader } from "@mantine/core";
import classes from "./auth-loader.module.css";

const AuthLoader = () => {
  return (
    <div className={classes.authLoader}>
      <Loader color="blue" type="bars" />
    </div>
  );
};

export default AuthLoader;