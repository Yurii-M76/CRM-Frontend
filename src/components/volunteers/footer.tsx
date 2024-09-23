import { Flex, Text } from "@mantine/core";
import { FC } from "react";
import { CRM_Pagination } from "../pagination/pagination";
import { Person } from "./types";

type TFooter = {
  tableData: Person[];
  rangeOnPage: number;
  activePage: number;
  setPage: (value: number) => void;
  setRangeOnPage: (value: number) => void;
  rowsSelect: number;
  totalRows: number;
};

export const Footer: FC<TFooter> = ({
  tableData,
  rangeOnPage,
  activePage,
  setPage,
  setRangeOnPage,
  rowsSelect,
  totalRows,
}) => (
  <Flex
    mih={50}
    gap="md"
    justify="space-between"
    align="center"
    direction="row"
    wrap="wrap"
    w="100%"
  >
    <Text size="sm" c="dimmed">
      Всего строк: {totalRows} / Выбрано: {rowsSelect}
    </Text>
    <CRM_Pagination
      activePage={activePage}
      dataLenght={tableData.length}
      rangeOnPage={rangeOnPage}
      setPage={setPage}
      setRangeOnPage={setRangeOnPage}
    />
  </Flex>
);
