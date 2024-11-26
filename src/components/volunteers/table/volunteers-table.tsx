import { Button, Checkbox, LoadingOverlay, Table } from "@mantine/core";
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
  resetSort,
  setAllChecked,
  setOneChecked,
  setSort,
} from "@/services/volunteer/reducer";
import { Footer } from "../footer/footer";
import { dateFormatForTable } from "@/utils/date-format-for-table";
import { Column, TVolunteer } from "@/types";
import { ProjectsListForTables } from "@/components/lists-of-cells-for-tables/projects-list-for-tables";
import { VolunteersTableToolbar } from "../toolbar/volunteers-table-toolbar";
import { ActionButtons, NoData, THeadSortButton } from "@/components/table";
import classes from "@components/table/table.module.css";

export const VolonteersTable = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getVolunteersLoading);
  const volunteers = useSelector(getVolunteers);
  const sortBy = useSelector(getSortBy);
  const sortOrder = useSelector(getSortOrder);
  const checkedIds = useSelector(getOneChecked);
  const countVolunteers = useSelector(getCountVolunteers);
  useEffect(() => {
    dispatch(getAllVolunteers());
  }, [dispatch]);
  const columns: Column<TVolunteer>[] = [
    { label: "ФИО", accessor: "surname", size: 200, sorted: true },
    { label: "Телефон", accessor: "phone", size: 150, sorted: true },
    { label: "Дата рождения", accessor: "birthday", size: 180, sorted: true },
    { label: "E-Mail", accessor: "email", size: 200, sorted: true },
    { label: "Рейтинг", accessor: "rating", size: 130, sorted: true },
    { label: "Проекты", accessor: "projects", size: 200, sorted: true },
  ];
  const widthTable = columns.reduce((sum, column) => sum + column.size, 0);
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
  const rows = volunteers.map((item) => (
    <Table.Tr key={item.id}>
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
        <ProjectsListForTables data={item.projects} />
      </Table.Td>
      <Table.Td>
        <ActionButtons />
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <div
      className={classes.container}
      style={{
        maxInlineSize: `${widthTable + 300}px`,
        minInlineSize: "350px",
      }}
    >
      <LoadingOverlay visible={isLoading} />
      <VolunteersTableToolbar />
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
              {columns.map((column, index) => (
                <Table.Th
                  miw={column.size}
                  maw={column.size}
                  key={index}
                  className={classes.tableTh}
                >
                  <div className={classes.column_name}>
                    <Button.Group>
                      <Button
                        variant="light"
                        color="blue"
                        size="compact-sm"
                        onClick={() =>
                          column.sorted && sortedColumn(column.accessor)
                        }
                      >
                        {column.label}
                      </Button>
                      <THeadSortButton
                        accessor={column.accessor}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        resetSort={() => dispatch(resetSort())}
                      />
                    </Button.Group>
                  </div>
                </Table.Th>
              ))}
              <Table.Th w={100}>{/*actions*/}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        {!volunteers.length && <NoData />}
      </div>
      <Footer checkedIds={checkedIds.length} />
    </div>
  );
};
