import { Button, Checkbox, Loader, Table } from "@mantine/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "@/services/store";
import { getAllVolunteers } from "@/services/volunteer/action";
import {
  getSortOrder,
  getVolunteers,
  getVolunteersLoading,
  setSort,
} from "@/services/volunteer/reducer";
import { ProjectList } from "./project-list";
import { ButtonGroupLeft } from "../control-panel/button-group-left";
import { ButtonGroupRight } from "../control-panel/button-group-right";
import { Search } from "../control-panel/search";
import { Info } from "../footer/info";
import { SortButton } from "./sort-button";
import { Column } from "../types";
import { TVolunteer } from "@/utils/types";
import classes from "./volunteers-table.module.css";

// FIXME: Исправить тип данных ДР в БД
// FIXME: Исправить сортировку по дате рождения
// FIXME: Исправить отображение на мобильных экранах
// FIXME: Исправить дерганье столбцов при появлении иконки сортировки

export const VolonteersTable = () => {
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

  const rows = volunteers.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Checkbox />
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
      <Table.Td>edit / delete</Table.Td>
    </Table.Tr>
  ));

  if (loading) {
    return <Loader size={20} color="blue" />;
  } else {
    return (
      <div className={classes.container}>
        <div className={classes.control}>
          <div className={classes.buttons}>
            <ButtonGroupLeft />
          </div>
          <div className={classes.search}>
            <Search />
          </div>
          <div className={classes.filters}>
            <ButtonGroupRight />
          </div>
        </div>
        <Table verticalSpacing="6px" className={classes.table}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className={classes.thead}>
                <Checkbox />
              </Table.Th>
              {columns.map((column, index) => (
                <Table.Th
                  key={index}
                  className={classes.thead}
                >
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
        <div className={classes.footer}>
          <div className={classes.info}>
            <Info />
          </div>
          <div className={classes.pagination}>pagination</div>
        </div>
      </div>
    );
  }
};
