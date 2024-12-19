import { useDispatch } from "@/services/store";
import { Pagination, Select, Tooltip } from "@mantine/core";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { FC, useEffect, useState } from "react";
import classes from "../table/table.module.css";

type TPaginator = {
  count: number;
  rowsOnPage: number;
  setActivePage: ActionCreatorWithPayload<number>;
  setRangeOnPage: ActionCreatorWithPayload<number>;
};

export const Paginator: FC<TPaginator> = ({
  count,
  rowsOnPage,
  setActivePage,
  setRangeOnPage,
}) => {
  const dispatch = useDispatch();
  const totalPages = Math.ceil(count / rowsOnPage);
  const [activePage, setPage] = useState(1);

  const handleChange = (data: string | null) => {
    return data ? dispatch(setRangeOnPage(+data)) : null;
  };

  useEffect(() => {
    dispatch(setActivePage(activePage));
  }, [dispatch, activePage, rowsOnPage, setActivePage]);

  return (
    <div className={classes.flexGroup}>
      <Pagination
        total={totalPages || 1}
        value={activePage}
        onChange={setPage}
        disabled={!totalPages}
        color={!totalPages ? "gray" : "blue"}
        withEdges
        siblings={1}
        boundaries={0}
      />
      <Tooltip label="Строк на странице">
        <Select
          data={["5", "10", "25", "50", "100"]}
          defaultValue={String(rowsOnPage)}
          w={80}
          disabled={!totalPages}
          onChange={(data) => {
            handleChange(data);
            setPage(1);
          }}
          placeholder="Выберите количество строк на странице"
        />
      </Tooltip>
    </div>
  );
};
