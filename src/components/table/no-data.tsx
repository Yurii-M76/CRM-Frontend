import { Text } from "@mantine/core";
import classes from "@components/table/table.module.css";

const NoData = () => {
  return (
    <div className={classes.tableNoData}>
      <Text c="dimmed">нет данных</Text>
    </div>
  );
};

export default NoData;