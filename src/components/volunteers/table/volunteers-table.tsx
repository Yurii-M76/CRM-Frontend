import { Button, Checkbox, Table } from "@mantine/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "@/services/store";
import { getAllVolunteers } from "@/services/volunteer/action";
import {
  getCountVolunteers,
  getOneChecked,
  getSortBy,
  getSortOrder,
  getVolunteers,
  getVolunteersLoading,
  getRangeOnPage,
  setActivePage,
  setRangeOnPage,
  setAllChecked,
  setOneChecked,
  setSort,
  resetSort,
  resetAllChecked,
} from "@/services/volunteer/reducer";
import { dateFormatForTable } from "@/utils/date-format-for-table";
import { Column, TVolunteer } from "@/types";
import { VolunteersTableToolbar } from "../toolbar/volunteers-table-toolbar";
import {
  ActionButtons,
  NoData,
  TableInfoBlock,
  THeadSortButton,
} from "@/components/table";
import { Paginator } from "@/components/paginator/paginator";
import classes from "@components/table/table.module.css";
import { Loader } from "@/components/loader/loader";
import { ScrollBlock } from "@/components/scroll-block/scroll-block";

const columns: Column<TVolunteer>[] = [
  { label: "ФИО", accessor: "surname", size: 260, sorted: true },
  { label: "Телефон", accessor: "phone", size: 150, sorted: true },
  { label: "Дата рождения", accessor: "birthday", size: 180, sorted: true },
  { label: "E-Mail", accessor: "email", size: 200, sorted: true },
  { label: "Рейтинг", accessor: "rating", size: 130, sorted: true },
  { label: "Проекты", accessor: "projects", size: 260, sorted: false },
];
const widthTable = columns.reduce((sum, column) => sum + column.size, 0);

export const VolonteersTable = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getVolunteersLoading);
  const volunteers = useSelector(getVolunteers);
  const sortBy = useSelector(getSortBy);
  const sortOrder = useSelector(getSortOrder);
  const checkedIds = useSelector(getOneChecked);
  const countVolunteers = useSelector(getCountVolunteers);
  const rowsOnPage = useSelector(getRangeOnPage);
  const disabled = isLoading || !volunteers.length;
  const loader = isLoading && <Loader />;
  const noData = !volunteers.length && <NoData />;

  const sortedColumn = (sortBy: keyof TVolunteer) => {
    dispatch(
      setSort({
        sortBy: sortBy,
        sortOrder: sortOrder === "asc" ? "desc" : "asc",
      })
    );
  };

  const indeterminate =
    checkedIds.length > 0 && checkedIds.length < countVolunteers;
  const isAllCheched =
    countVolunteers !== 0 && checkedIds.length === countVolunteers;

  const thead = columns.map((column, index) => (
    <Table.Th
      miw={column.size}
      maw={column.size}
      key={index}
      className={classes.tableTh}
    >
      <div className={classes.column_name}>
        <Button.Group>
          <Button
            variant={"light"}
            color={column.sorted ? "blue" : "violet"}
            size="compact-sm"
            onClick={() => column.sorted && sortedColumn(column.accessor)}
            disabled={disabled}
          >
            {column.label}
          </Button>
          <THeadSortButton
            accessor={column.accessor}
            sortBy={sortBy}
            sortOrder={sortOrder}
            resetSort={() => dispatch(resetSort())}
            isDisabled={disabled}
          />
        </Button.Group>
      </div>
    </Table.Th>
  ));

  const rows =
    !isLoading &&
    volunteers.map((item) => (
      <Table.Tr
        key={item.id}
        bg={
          checkedIds.includes(item.id)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            key={item.id}
            checked={checkedIds.includes(item.id)}
            onChange={() => dispatch(setOneChecked(item.id))}
          />
        </Table.Td>
        <Table.Td>
          {item.surname} {item.name} {item.patronymic}
        </Table.Td>
        <Table.Td>{item.phone ?? "-"}</Table.Td>
        <Table.Td>{dateFormatForTable(item.birthday) ?? "-"}</Table.Td>
        <Table.Td>{item.email ?? "-"}</Table.Td>
        <Table.Td>{item.rating ?? "-"}</Table.Td>
        <Table.Td>
          <ScrollBlock
            height={400}
            maxItems={3}
            totalItems={item.projects.length}
          >
            <ul>
              {item.projects.map((item) => {
                return <li key={item.id}>{item.title}</li>;
              })}
            </ul>
          </ScrollBlock>
        </Table.Td>
        <Table.Td>
          <ActionButtons />
        </Table.Td>
      </Table.Tr>
    ));

  useEffect(() => {
    dispatch(getAllVolunteers());
  }, [dispatch]);

  return (
    <div
      className={classes.container}
      style={{
        maxInlineSize: `${widthTable + 300}px`,
        minInlineSize: "350px",
      }}
    >
      <VolunteersTableToolbar isDisabled={disabled} />
      <div className={classes.tableBox}>
        <Table
          maw={widthTable + 250}
          highlightOnHover
          horizontalSpacing="md"
          verticalSpacing="10px"
          withColumnBorders
          className={classes.table}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th className={classes.thead}>
                <Checkbox
                  checked={isAllCheched}
                  indeterminate={indeterminate}
                  onChange={() => {
                    dispatch(setAllChecked());
                  }}
                />
              </Table.Th>
              {thead}
              <Table.Th w={100}>{/*actions*/}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        {loader}
        {noData}
      </div>
      <div className={classes.flexGroup}>
        <TableInfoBlock
          entityTitle="волонтеров"
          count={countVolunteers}
          checkedIds={checkedIds.length}
          resetAllChecked={resetAllChecked}
        />
        <Paginator
          count={countVolunteers}
          rowsOnPage={rowsOnPage}
          setActivePage={setActivePage}
          setRangeOnPage={setRangeOnPage}
        />
      </div>
    </div>
  );
};
