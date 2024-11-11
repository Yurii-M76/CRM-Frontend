import { FC, useState } from "react";
import { getCountVolunteers } from "@/services/volunteer/reducer";
import { useSelector } from "@/services/store";
import classes from "./footer.module.css";
import { Alert, Pagination, Select } from "@mantine/core";

type TFooter = {
  rows: number;
  checkedIds: Set<string>;
};

export const Footer: FC<TFooter> = ({ rows, checkedIds }) => {
  const countVolunteers = useSelector(getCountVolunteers);
  const [rowsOnPage, setRowsOnPage] = useState<number>(5);
  const totalPages = Math.ceil(rows / rowsOnPage);
  return (
    <div className={classes.footer}>
      <div className={classes.info}>
        <Alert
          variant="default"
          pt={6}
          pb={6}
          pl={12}
          pr={12}
        >{`Всего записей: ${countVolunteers} / Выбрано: ${checkedIds.size}`}</Alert>
      </div>
      <div className={classes.pagination}>
        <Pagination total={totalPages} />
        <Select
          data={["5", "10", "25", "50", "100"]}
          defaultValue={"5"}
          w={80}
          onChange={(event) => {
            return event && setRowsOnPage(+event);
          }}
        ></Select>
      </div>
    </div>
  );
};
