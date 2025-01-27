import { Button, Pill, Table, Text } from "@mantine/core";
import { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "@/services/store";
import { deleteProject, findAllProjects } from "@/services/project/action";
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
import { ButtonsFromDeleteForm, FormSaveProject } from "@components/forms";
import { Column, TCalendar, TProject } from "@/types";
import classes from "../table/table.module.css";
import { formatDateToString } from "@/utils";

const columns: Column<TProject>[] = [
  { label: "Дата", accessor: "dates", size: 124, sorted: true },
  { label: "Название", accessor: "title", size: 220, sorted: true },
  { label: "Описание", accessor: "description", size: 340, sorted: true },
  { label: "Район", accessor: "districts", size: 240, sorted: true },
  { label: "Участники", accessor: "persons", size: 250, sorted: true },
  { label: "Примечание", accessor: "note", size: 250, sorted: true },
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
  const [isOpenCreateForm, setIsOpenCreateForm] = useState<boolean>(false);
  const [isOpenUpdateForm, setIsOpenUpdateForm] = useState<boolean>(false);
  const [isOpenConfirmAction, setIsOpenConfirmAction] = useState(false);
  const [projectData, setProjectData] = useState<TProject | undefined>(
    undefined
  );
  const [projectId, setProjectId] = useState<string | null>(null);
  const loader = status.read.loading && <Loader />;
  const noData = !status.read.loading && !projects.length && <NoData />;
  const emptyLineToCell = "-"; // заглушка для ячеек без данных

  const updateClickHandler = (id: string) => {
    setIsOpenUpdateForm(true);
    setProjectId(id);
    const dataToUpdate = projects.find((project) => project.id === id);
    setProjectData(dataToUpdate);
  };

  const deleteClickHandler = (id: string) => {
    setIsOpenConfirmAction(true);
    setProjectId(id);
  };

  const sortedColumn = (sortBy: keyof TProject) => {
    dispatch(
      setSort({
        sortBy: sortBy,
        sortOrder: sortOrder === "asc" ? "desc" : "asc",
      })
    );
  };

  const formatDateToCell = (dates: Date[], calendar: TCalendar): string[] => {
    const result: string[] = [];
    const format = "day_month";

    if (calendar === "default") {
      result.push(formatDateToString(dates[0], format));
    }
    if (calendar === "range") {
      const _range = dates
        .map((date) => formatDateToString(date, format))
        .join(" - ");
      result.push(_range);
    }
    if (calendar === "multiple") {
      const _multiple = dates
        .map((date) => formatDateToString(date, format))
        .join(", ");
      result.push(_multiple);
    }
    return result.length ? result : ["не определена"];
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

  const rows =
    !status.read.loading &&
    projects.map((item) => (
      <Table.Tr key={item.id}>
        <Table.Td>
          <Pill.Group gap={3}>
            {formatDateToCell(item.dates, item.calendar)}
          </Pill.Group>
        </Table.Td>
        <Table.Td>{item.title}</Table.Td>
        <Table.Td>{item.description || emptyLineToCell}</Table.Td>
        <Table.Td>
          <Pill.Group gap={3}>
            {item.districts.map((district) => (
              <Pill key={district.id} mr={4} size="md">
                {district.name}
              </Pill>
            ))}
          </Pill.Group>
        </Table.Td>
        <Table.Td>
          <CollapseList totalItems={item.persons.length}>
            <ul className={classes.listItemsForCell}>
              {item.persons.length
                ? item.persons.map((item) => {
                    return <li key={item.id}>{item.fullName}</li>;
                  })
                : emptyLineToCell}
            </ul>
          </CollapseList>
        </Table.Td>
        <Table.Td>{item.note || emptyLineToCell}</Table.Td>
        <Table.Td>
          <ActionButtons
            handleClickFromEdit={() => updateClickHandler(item.id)}
            handleClickFromDelete={() => deleteClickHandler(item.id)}
          />
        </Table.Td>
      </Table.Tr>
    ));

  useEffect(() => {
    dispatch(findAllProjects());
    dispatch(getAllPersons());
    dispatch(getAllDistricts());
  }, [dispatch]);

  useEffect(() => {
    if (status.create.success) {
      setIsOpenCreateForm(false);
    }
  }, [status.create.success]);

  useEffect(() => {
    if (status.update.success) {
      setIsOpenUpdateForm(false);
    }
  }, [status.update.success]);

  useEffect(() => {
    if (status.delete.success) {
      setIsOpenConfirmAction(false);
    }
  }, [status.delete.success]);

  return (
    <>
      <div className={classes.container} style={{ maxWidth: widthTable }}>
        <TableToolbar
          isLoading={status.read.loading}
          openedSaveForm={() => setIsOpenCreateForm(true)}
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
            maw={widthTable}
            miw={widthTable - 100}
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
        opened={isOpenCreateForm}
        close={() => setIsOpenCreateForm(false)}
        size="lg"
      >
        <FormSaveProject
          persons={persons}
          districts={districts}
          onClose={() => setIsOpenCreateForm(false)}
        />
      </Modal>

      <Modal
        title="Редактировать запись"
        opened={isOpenUpdateForm}
        close={() => {
          setIsOpenUpdateForm(false);
          setProjectId(null);
        }}
        size="lg"
      >
        <FormSaveProject
          updData={projectData}
          persons={persons}
          districts={districts}
          onClose={() => setIsOpenUpdateForm(false)}
        />
      </Modal>

      <Modal
        title="Подтверждение действия"
        opened={isOpenConfirmAction}
        close={() => {
          setIsOpenConfirmAction(!isOpenConfirmAction);
          setProjectId(null);
        }}
        closeButton={false}
        size="md"
      >
        <Text>
          Вы уверены, что хотите удалить запись? Это действие нельзя отменить.
        </Text>
        <ButtonsFromDeleteForm
          loading={status.delete.loading}
          onClickToCancel={() => {
            setIsOpenConfirmAction(false);
            setProjectId(null);
          }}
          onClickToDelete={() =>
            projectId && dispatch(deleteProject(projectId))
          }
        />
      </Modal>
    </>
  );
};

export default ProjectsTable;
