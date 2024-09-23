import { Flex, Pagination, Select } from "@mantine/core";
import { FC } from "react";

type CRM_Pagination = {
  dataLenght: number;
  rangeOnPage: number;
  activePage: number;
  setPage: (value: number) => void;
  setRangeOnPage: (value: number) => void;
};

export const CRM_Pagination: FC<CRM_Pagination> = ({
  dataLenght,
  rangeOnPage,
  activePage,
  setPage,
  setRangeOnPage,
}) => (
  <Flex
    mih={50}
    gap="md"
    justify="flex-end"
    align="center"
    direction="row"
    wrap="wrap"
  >
    <Pagination
      total={Math.ceil(dataLenght / rangeOnPage)}
      value={activePage}
      onChange={setPage}
      siblings={1}
      defaultValue={1}
    />
    <Select
      value={String(rangeOnPage)}
      data={["10", "25", "50", "100"]}
      aria-label="Строк на странице"
      onChange={(event) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        event && setRangeOnPage(+event);
        setPage(1);
      }}
      w={80}
    />
  </Flex>
);
