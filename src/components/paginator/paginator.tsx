import { useDispatch } from "@/services/store";
import { Pagination, Select } from "@mantine/core";
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
  useEffect(() => {
    dispatch(setActivePage(activePage));
  }, [dispatch, activePage, rowsOnPage, setActivePage]);
  const handleChange = (data: string | null) => {
    return data ? dispatch(setRangeOnPage(+data)) : null;
  };
  return (
    <div className={classes.flexGroup}>
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
  );
};
