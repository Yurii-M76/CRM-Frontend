import {
  Blockquote,
  Box,
  Button,
  Center,
  Checkbox,
  LoadingOverlay,
  Table,
} from "@mantine/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "@/services/store";
import { getAllVolunteers } from "@/services/volunteer/action";
import {
  getCountVolunteers,
  getOneChecked,
  getSortOrder,
  getVolunteers,
  getVolunteersLoading,
  setAllChecked,
  setOneChecked,
  setSort,
} from "@/services/volunteer/reducer";
import { ProjectList } from "./project-list";
import { SortButton } from "./sort-button";
import { Footer } from "../footer/footer";
import { Head } from "../head/head";
import { Tools } from "./tools";
import { dateFormatForTable } from "@/utils/date-format-for-table";
import classes from "./volunteers-table.module.css";
import { Column, TVolunteer } from "@/types";

export const VolonteersTable = () => {
  const dispatch = useDispatch();
  const loading = useSelector(getVolunteersLoading);
  const volunteers = useSelector(getVolunteers);
  const sortOrder = useSelector(getSortOrder);
  const checkedIds = useSelector(getOneChecked);
  const countVolunteers = useSelector(getCountVolunteers);
  useEffect(() => {
    dispatch(getAllVolunteers());
  }, [dispatch]);
  const columns: Column[] = [
    { label: "ФИО", accessor: "surname", sorted: true },
    { label: "Телефон", accessor: "phone", sorted: true },
    { label: "Дата рождения", accessor: "birthday", sorted: true },
    { label: "E-Mail", accessor: "email", sorted: true },
    { label: "Рейтинг", accessor: "rating", sorted: true },
    { label: "Проекты", accessor: "projects", sorted: true },
  ];
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
        <ProjectList data={item.projects} />
      </Table.Td>
      <Table.Td>
        <Tools />
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} />
      <div className={classes.container}>
        <Head />
        <div className={classes.wrapper}>
          <Table verticalSpacing="6px" className={classes.table}>
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
                  <Table.Th key={index} className={classes.thead}>
                    <div className={classes.column_name}>
                      <Button.Group>
                        <Button
                          variant="light"
                          color="blue"
                          size="compact-sm"
                          className={classes.column_label}
                          onClick={() =>
                            column.sorted && sortedColumn(column.accessor)
                          }
                        >
                          {column.label}
                        </Button>
                        <SortButton accessor={column.accessor} />
                      </Button.Group>
                    </div>
                  </Table.Th>
                ))}
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
          {!volunteers.length && (
            <Blockquote color="gray" mt={20} p={12} mb={0}>
              <Center>нет данных</Center>
            </Blockquote>
          )}
        </div>
        <Footer checkedIds={checkedIds.length} />
      </div>
    </Box>
  );
};
