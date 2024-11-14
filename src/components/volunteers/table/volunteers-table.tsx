import {
  Blockquote,
  Box,
  Button,
  Center,
  Checkbox,
  LoadingOverlay,
  Table,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "@/services/store";
import { getAllVolunteers } from "@/services/volunteer/action";
import {
  getSortOrder,
  getVolunteers,
  getVolunteersLoading,
  setSort,
} from "@/services/volunteer/reducer";
import { ProjectList } from "./project-list";
import { SortButton } from "./sort-button";
import { Column } from "../types";
import { TVolunteer } from "@/utils/types";
import { Footer } from "../footer/footer";
import { Head } from "../head/head";
import { Tools } from "./tools";
import classes from "./volunteers-table.module.css";

// TODO: Добавить форму ввода данных

// FIXME: Исправить тип данных ДР в БД
// FIXME: Исправить сортировку по дате рождения
// FIXME: Исправить дерганье столбцов при появлении иконки сортировки
// FIXME: Проверить стили на неиспользуемые селекторы

export const VolonteersTable = () => {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const dispatch = useDispatch();
  const loading = useSelector(getVolunteersLoading);
  const volunteers = useSelector(getVolunteers);
  const sortOrder = useSelector(getSortOrder);

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

  // Статус чекбокса в шапке колонки
  const indeterminate =
    checkedIds.size > 0 && checkedIds.size < volunteers.length;
  const updateCheckedIds = (newCheckedIds: Set<string>) => {
    setCheckedIds(newCheckedIds);
    setIsCheckedAll(newCheckedIds.size === volunteers.length);
  };

  const handleCheckedOne = (id: string) => {
    const newCheckedIds = new Set(checkedIds);
    if (newCheckedIds.has(id)) {
      newCheckedIds.delete(id);
    } else {
      newCheckedIds.add(id);
    }
    updateCheckedIds(newCheckedIds);
  };

  const handleCheckedAll = () => {
    const newCheckedIds: Set<string> = isCheckedAll
      ? new Set()
      : new Set(volunteers.map((item) => item.id));
    updateCheckedIds(newCheckedIds);
  };

  const rows = volunteers.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Checkbox
          key={item.id}
          checked={checkedIds.has(item.id)}
          onChange={() => handleCheckedOne(item.id)}
        />
      </Table.Td>
      <Table.Td>
        {item.surname} {item.name} {item.patronymic}
      </Table.Td>
      <Table.Td>{item.phone ?? "-"}</Table.Td>
      <Table.Td>{item.birthday ?? "-"}</Table.Td>
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
      <LoadingOverlay
        visible={loading}
        // loaderProps={{ children: <Loader color="blue" /> }}
      />
      <div className={classes.container}>
        <Head />
        <div className={classes.wrapper}>
          <Table verticalSpacing="6px" className={classes.table}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className={classes.thead}>
                  <Checkbox
                    checked={isCheckedAll}
                    indeterminate={indeterminate}
                    onChange={handleCheckedAll}
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
        <Footer checkedIds={checkedIds} />
      </div>
    </Box>
  );
};
