import { Anchor, Group, Pagination, Select, Text } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import {
  getCountVolunteers,
  getRangeOnPage,
  resetAllChecked,
  setActivePage,
  setRangeOnPage,
} from "@/services/volunteer/reducer";
import { useDispatch, useSelector } from "@/services/store";
import classes from "./footer.module.css";

type TFooter = {
  checkedIds: number;
};

export const Footer: FC<TFooter> = ({ checkedIds }) => {
  const dispatch = useDispatch();
  const countVolunteers = useSelector(getCountVolunteers);
  const rowsOnPage = useSelector(getRangeOnPage);
  const totalPages = Math.ceil(countVolunteers / rowsOnPage);
  const [activePage, setPage] = useState(1);
  useEffect(() => {
    dispatch(setActivePage(activePage));
    localStorage.setItem("rowsOnPageVolunteersTable", String(rowsOnPage));
  }, [dispatch, activePage, rowsOnPage]);
  const handleChange = (data: string | null) => {
    return data ? dispatch(setRangeOnPage(+data)) : null;
  };
  const checkedItems = checkedIds ? `/ Выбрано: ${checkedIds} ` : "";
  return (
    <div className={classes.footer}>
      <Group c="dimmed" gap={5}>
        <Text>{`Всего записей: ${countVolunteers}`}</Text>
        {checkedItems && (
          <Text>
            {checkedItems}
            <Anchor href="#" onClick={() => dispatch(resetAllChecked())}>
              [очистить]
            </Anchor>
          </Text>
        )}
      </Group>
      <div className={classes.pagination}>
        <Pagination
          total={totalPages || 1}
          value={activePage}
          onChange={setPage}
          disabled={!totalPages}
          color={!totalPages ? "gray" : "blue"}
        />
        <Select
          data={["5", "10", "25", "50", "100"]}
          defaultValue={String(rowsOnPage)}
          w={80}
          disabled={!totalPages}
          onChange={(data) => {
            handleChange(data);
            setPage(1);
          }}
        ></Select>
      </div>
    </div>
  );
};
