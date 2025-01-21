import { Button, Table } from "@mantine/core";
import { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "@/services/store";
import { findAllProjects } from "@/services/project/action";
import {
  getProjectsStatus,
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
import {
  Loader,
  CollapseList,
  ActionButtons,
  NoData,
  THeadSortButton,
  TableInfoBlock,
  Modal,
} from "@components";
const TableToolbar = lazy(
  () => import("@components/table/table-toolbar/table-toolbar")
);
const Paginator = lazy(() => import("@components/paginator/paginator"));
import { getPersons } from "@/services/person/reducer";
import { getAllPersons } from "@/services/person/action";
import { getDistricts } from "@/services/districts/reducer";
import { getAllDistricts } from "@/services/districts/action";
import { FormSaveProject } from "../forms";
import { Column, TProject } from "@/types";
import classes from "../table/table.module.css";

const columns: Column<TProject>[] = [
  { label: "Название", accessor: "title", size: 300, sorted: true },
  { label: "Описание", accessor: "description", size: 400, sorted: true },
  { label: "Участники", accessor: "persons", size: 320, sorted: false },
];

const widthColumnFromCheckbox = 60;
const widthColumnFromActionButtons = 60;
const widthTable =
  columns.reduce((sum, column) => sum + column.size, 0) +
  widthColumnFromCheckbox +
  widthColumnFromActionButtons;

const ProjectsTable = () => {
  const dispatch = useDispatch();
  const status = useSelector(getProjectsStatus);
  const projects = useSelector(getProjects);
  const persons = useSelector(getPersons);
  const districts = useSelector(getDistricts);
  const sortBy = useSelector(getSortBy);
  const sortOrder = useSelector(getSortOrder);
  const countProjects = useSelector(getCountProjects);
  const rowsOnPage = useSelector(getRangeOnPage);
  const [isOpenSaveProject, setIsOpenSaveProject] = useState<boolean>(false);
  const loader = status.read.loading && <Loader />;
  const noData = !status.read.loading && !projects.length && <NoData />;

  const sortedColumn = (sortBy: keyof TProject) => {
    dispatch(
      setSort({
        sortBy: sortBy,
        sortOrder: sortOrder === "asc" ? "desc" : "asc",
      })
    );
  };

  const thead = columns.map((column, index) => (
    <Table.Th w={column.size} key={index} className={classes.tableTh}>
      {column.label && (
        <Button.Group>
          <Button
            variant="light"
            color={column.sorted ? "blue" : "violet"}
            size="compact-sm"
            m={0}
            onClick={() => column.sorted && sortedColumn(column.accessor)}
            disabled={status.read.loading || !projects.length}
          >
            {column.label}
          </Button>
          <THeadSortButton
            accessor={column.accessor}
            sortBy={sortBy}
            sortOrder={sortOrder}
            resetSort={() => dispatch(resetSort())}
            isDisabled={status.read.loading}
          />
        </Button.Group>
      )}
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
    !status.read.loading &&
    projects.map((item) => (
      <Table.Tr key={item.id}>
        <Table.Td>{item.title}</Table.Td>
        <Table.Td>{item.description}</Table.Td>
        <Table.Td>
          <CollapseList totalItems={item.persons.length}>
            <ul>
              {item.persons.length
                ? item.persons.map((item) => (
                    <li key={item.id}>
                      {PersonFullName(item.surname, item.name, item.patronymic)}
                    </li>
                  ))
                : "-"}
            </ul>
          </CollapseList>
        </Table.Td>
        <Table.Td>
          <ActionButtons
            handleClickFromEdit={() => ""}
            handleClickFromDelete={() => ""}
          />
        </Table.Td>
      </Table.Tr>
    ));

  useEffect(() => {
    dispatch(findAllProjects());
    dispatch(getAllPersons());
    dispatch(getAllDistricts());
  }, [dispatch]);

  return (
    <>
      <div className={classes.container} style={{ maxWidth: widthTable }}>
        <TableToolbar
          isLoading={status.read.loading}
          openedSaveForm={() => setIsOpenSaveProject(true)}
          buttons={{
            addButton: true,
            downloadButton: false,
            uploadButton: true,
            filterButton: true,
          }}
          disabledButtons={{
            addButton: false,
            uploadButton: true,
            filterButton: true,
          }}
        />
        <div className={classes.tableBox}>
          <Table
            striped
            highlightOnHover
            horizontalSpacing="md"
            withColumnBorders
            withTableBorder
            className={classes.table}
          >
            <Table.Thead>
              <Table.Tr>
                {thead}
                <Table.Th w={widthColumnFromActionButtons}>Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{!status.read.loading && rows}</Table.Tbody>
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
      <Modal
        title="Добавить запись"
        opened={isOpenSaveProject}
        close={() => setIsOpenSaveProject(false)}
        size="lg"
      >
        <FormSaveProject
          persons={persons}
          districts={districts}
          onClose={() => setIsOpenSaveProject(false)}
        />
      </Modal>
    </>
  );
};

export default ProjectsTable;
