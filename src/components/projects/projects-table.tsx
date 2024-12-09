// TODO: реализовать добавление проекта через форму
// TODO: реализовать редактирование проекта через форму
// TODO: реализовать удаление проекта по кнопке

import { Button, Table } from "@mantine/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "@/services/store";
import { findAllProjects } from "@/services/project/action";
import {
  getProjectsLoading,
  getProjects,
  setSort,
  getSortBy,
  getCountProjects,
  getRangeOnPage,
  setActivePage,
  setRangeOnPage,
  getSortOrder,
  resetSort,
} from "@/services/project/reducer";
import { Column, TProject } from "@/types";
import { ProjectsTableToolbar } from ".";
import {
  // ActionButtons,
  THeadSortButton,
  NoData,
  TableInfoBlock,
} from "@components/table";
import { Loader } from "../loader/loader";
import { Paginator } from "../paginator/paginator";
import { ScrollBlock } from "../scroll-block/scroll-block";
import classes from "../table/table.module.css";

const columns: Column<TProject>[] = [
  { label: "Название", accessor: "title", size: 200, sorted: true },
  { label: "Описание", accessor: "describe", size: 400, sorted: true },
  { label: "Участники", accessor: "persons", size: 300, sorted: false },
];
const widthTable = columns.reduce((sum, column) => sum + column.size, 0);

export const ProjectsTable = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getProjectsLoading);
  const projects = useSelector(getProjects);
  const sortBy = useSelector(getSortBy);
  const sortOrder = useSelector(getSortOrder);
  const countProjects = useSelector(getCountProjects);
  const rowsOnPage = useSelector(getRangeOnPage);
  const loader = isLoading && <Loader />;
  const noData = !isLoading && !projects.length && <NoData />;

  const sortedColumn = (sortBy: keyof TProject) => {
    dispatch(
      setSort({
        sortBy: sortBy,
        sortOrder: sortOrder === "asc" ? "desc" : "asc",
      })
    );
  };

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
            variant="light"
            color={column.sorted ? "blue" : "violet"}
            size="compact-sm"
            onClick={() => column.sorted && sortedColumn(column.accessor)}
            disabled={isLoading || !projects.length}
          >
            {column.label}
          </Button>
          <THeadSortButton
            accessor={column.accessor}
            sortBy={sortBy}
            sortOrder={sortOrder}
            resetSort={() => dispatch(resetSort())}
            isDisabled={isLoading}
          />
        </Button.Group>
      </div>
    </Table.Th>
  ));

  const PersonFullName = (
    surname: string,
    name: string,
    patronymic: string
  ): string => {
    const checkSurname = surname ? surname : "";
    const checkName = name ? name : "";
    const checkPatronymic = patronymic ? patronymic : "";
    const result = `${checkSurname} ${checkName} ${checkPatronymic}`.trim();
    return result;
  };

  const rows =
    !isLoading &&
    projects.map((item) => (
      <Table.Tr key={item.id}>
        <Table.Td>{item.title}</Table.Td>
        <Table.Td>{item.describe}</Table.Td>
        <Table.Td>
          <ScrollBlock
            height={400}
            maxItems={3}
            totalItems={item.persons.length}
          >
            <ul>
              {item.persons.length
                ? item.persons.map((item) => (
                    <li key={item.id}>
                      {PersonFullName(item.surname, item.name, item.patronymic)}
                    </li>
                  ))
                : "-"}
            </ul>
          </ScrollBlock>
        </Table.Td>
        <Table.Td>{/* <ActionButtons /> */}</Table.Td>
      </Table.Tr>
    ));

  useEffect(() => {
    dispatch(findAllProjects());
  }, [dispatch]);

  return (
    <div
      className={classes.container}
      style={{ maxInlineSize: `${widthTable + 300}px`, minInlineSize: "350px" }}
    >
      <ProjectsTableToolbar
        isLoading={isLoading}
        isDisabled={!projects.length}
      />
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
          entityTitle="проектов"
          count={countProjects}
          checkedIds={0}
        />
        <Paginator
          count={countProjects}
          rowsOnPage={rowsOnPage}
          setActivePage={setActivePage}
          setRangeOnPage={setRangeOnPage}
        />
      </div>
    </div>
  );
};
