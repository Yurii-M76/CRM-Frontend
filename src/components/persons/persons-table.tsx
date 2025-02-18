import { Anchor, Button, Checkbox, Pill, Table, Text } from "@mantine/core";
import { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "@/services/store";
import { deletePerson, getAllPersons } from "@/services/person/action";
import { findAllProjects } from "@/services/project/action";
import { getAllDistricts } from "@/services/districts/action";
import {
  getCountPersons,
  getOneChecked,
  getSortBy,
  getSortOrder,
  getPersons,
  getRangeOnPage,
  setActivePage,
  setRangeOnPage,
  setAllChecked,
  setOneChecked,
  setSort,
  resetSort,
  resetAllChecked,
  getPersonsStatus,
  getIsFiltered,
  resetFilters,
} from "@/services/person/reducer";
import { resetSearch, setSearch } from "@/services/person/reducer";
import { getProjects } from "@/services/project/reducer";
import { getDistricts } from "@/services/districts/reducer";
import { getStatusFile } from "@/services/files/reducer";
import {
  Loader,
  Modal,
  CollapsedList,
  ActionButtons,
  NoData,
  TableInfoBlock,
  THeadSortButton,
  ButtonsFromDeleteForm,
  Alert,
} from "@components";
const TableToolbar = lazy(
  () => import("@components/table/table-toolbar/table-toolbar")
);
const Paginator = lazy(() => import("@components/paginator/paginator"));
import {
  FormSavePerson,
  PersonsFiltersForm,
  Search,
  UploadFilesForm,
} from "@components/forms";
import { formatDateToString, exportToExcel } from "@/utils";
import { Column, TPerson, TProject } from "@/types";
import { personRoles } from "./person-roles";
import classes from "@components/table/table.module.css";

const columns: Column<TPerson>[] = [
  { label: "ФИО", accessor: "fullName", size: 200, sorted: true },
  { label: "Телефон", accessor: "phone", size: 180, sorted: true },
  { label: "Дата рождения", accessor: "birthday", size: 180, sorted: true },
  { label: "E-Mail", accessor: "email", size: 180, sorted: true },
  { label: "Роль", accessor: "roles", size: 140, sorted: false },
  { label: "Проекты", accessor: "projects", size: 260, sorted: true },
  { label: "Район", accessor: "districts", size: 240, sorted: true },
];

const widthColumnFromCheckbox = 60;
const widthColumnFromActionButtons = 60;
const widthTable =
  columns.reduce((sum, column) => sum + column.size, 0) +
  widthColumnFromCheckbox +
  widthColumnFromActionButtons;

const PersonsTable = () => {
  const dispatch = useDispatch();
  const status = useSelector(getPersonsStatus);
  const persons = useSelector(getPersons);
  const projects = useSelector(getProjects);
  const districts = useSelector(getDistricts);
  const sortBy = useSelector(getSortBy);
  const sortOrder = useSelector(getSortOrder);
  const checkedIds = useSelector(getOneChecked);
  const countPersons = useSelector(getCountPersons);
  const rowsOnPage = useSelector(getRangeOnPage);
  const isFiltered = useSelector(getIsFiltered);
  const statusFile = useSelector(getStatusFile);
  const [isOpenCreateForm, setIsOpenCreateForm] = useState(false);
  const [isOpenUpdateForm, setIsOpenUpdateForm] = useState(false);
  const [isOpenFiltersForm, setIsOpenFiltersForm] = useState(false);
  const [isOpenConfirmAction, setIsOpenConfirmAction] = useState(false);
  const [isOpenUploadFile, setIsOpenUploadFile] = useState(false);
  const [personData, setPersonData] = useState<TPerson | undefined>(undefined);
  const [personId, setPersonId] = useState<string | null>(null);

  const isLoading = status.read.loading;
  const loader = isLoading && <Loader />;
  const noData = !isLoading && !persons.length && <NoData />;
  const emptyLineForCell = "-"; // заглушка для ячеек без данных

  const updateClickHandler = (id: string) => {
    setIsOpenUpdateForm(true);
    setPersonId(id);
    const dataToUpdate = persons.find((person) => person.id === id);
    setPersonData(dataToUpdate);
  };

  const deleteClickHandler = (id: string) => {
    setIsOpenConfirmAction(true);
    setPersonId(id);
  };

  const sortedColumn = (sortBy: keyof TPerson) => {
    dispatch(
      setSort({
        sortBy: sortBy,
        sortOrder: sortOrder === "asc" ? "desc" : "asc",
      })
    );
  };

  const PersonRoleLocale = (role: string) => {
    const roleItem = personRoles.find((r) => r.value === role);
    return roleItem ? roleItem.label : "";
  };

  const indeterminate =
    checkedIds.length > 0 && checkedIds.length < countPersons;
  const isAllCheched = countPersons !== 0 && checkedIds.length === countPersons;

  const thead = columns.map((column, index) => (
    <Table.Th w={column.size} key={index} className={classes.tableTh}>
      {column.label && (
        <Button.Group>
          <Button
            variant={"light"}
            color={column.sorted ? "blue" : "violet"}
            size="compact-sm"
            m={0}
            onClick={() => {
              return column.sorted && sortedColumn(column.accessor);
            }}
            disabled={isLoading || !persons.length}
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
      )}
    </Table.Th>
  ));

  const rows =
    !isLoading &&
    persons.map((item) => (
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
        <Table.Td>{item.fullName}</Table.Td>
        <Table.Td>{item.phone || emptyLineForCell}</Table.Td>
        <Table.Td>
          {item.birthday
            ? formatDateToString(new Date(item.birthday), "DD.MM.YYYY")
            : emptyLineForCell}
        </Table.Td>
        <Table.Td>{item.email || emptyLineForCell}</Table.Td>
        <Table.Td>
          {(item.roles.length && (
            <Pill.Group gap={3}>
              {item.roles.map((role, index) => (
                <Pill key={index} mr={4} size="md">
                  {PersonRoleLocale(role)}
                </Pill>
              ))}
            </Pill.Group>
          )) ||
            emptyLineForCell}
        </Table.Td>
        <Table.Td>
          <CollapsedList<TProject>
            data={item.projects}
            field="title"
            limit={3}
          />
        </Table.Td>
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
          <ActionButtons
            handleClickFromEdit={() => updateClickHandler(item.id)}
            handleClickFromDelete={() => deleteClickHandler(item.id)}
          />
        </Table.Td>
      </Table.Tr>
    ));

  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        dispatch(getAllPersons()),
        dispatch(findAllProjects()),
        dispatch(getAllDistricts()),
      ]);
    };
    fetchInitialData();
  }, [dispatch]);

  useEffect(() => {
    const statuses = [
      status.create,
      status.update,
      status.delete,
      statusFile.upload,
    ];
    const modals = [
      setIsOpenCreateForm,
      setIsOpenUpdateForm,
      setIsOpenConfirmAction,
      setIsOpenUploadFile,
    ];
    statuses.forEach((status, index) => {
      if (status.success) {
        modals[index](false);
      }
    });
  }, [
    status.create,
    status.update,
    status.delete,
    statusFile.upload,
    setIsOpenCreateForm,
    setIsOpenUpdateForm,
    setIsOpenConfirmAction,
    setIsOpenUploadFile,
  ]);

  const headerForUploadPersonsForm = [
    { header: "Фамилия", key: "surname", width: 15 },
    { header: "Имя", key: "name", width: 15 },
    { header: "Отчество", key: "patronymic", width: 15 },
    { header: "Дата рождения", key: "birthday", width: 12 },
    { header: "Телефон", key: "phone", width: 15 },
    { header: "Email", key: "email", width: 20 },
    { header: "Роль", key: "roles", width: 20 },
    { header: "Район", key: "districts", width: 25 },
    { header: "Проекты", key: "projects", width: 30 },
    { header: "Автомобиль", key: "car", width: 15 },
    { header: "Организация", key: "organization", width: 20 },
    { header: "Примечание", key: "note", width: 30 },
  ];

  return (
    <>
      <div className={classes.container} style={{ maxWidth: widthTable }}>
        <TableToolbar
          isLoading={isLoading}
          openedSaveForm={() => setIsOpenCreateForm(true)}
          openedUploadFileForm={() => setIsOpenUploadFile(true)}
          openedFiltersForm={() => setIsOpenFiltersForm(true)}
          exportFn={() =>
            exportToExcel(
              persons,
              headerForUploadPersonsForm,
              [
                { key: "districts", label: "name" },
                { key: "projects", label: "title" },
              ],
              true,
              "persons"
            )
          }
          buttons={{
            addButton: true,
            downloadButton: true,
            uploadButton: true,
            filterButton: true,
            isFiltered: isFiltered,
            resetFilters: () => dispatch(resetFilters()),
          }}
          disabledButtons={{
            addButton: false,
            uploadButton: false,
            downloadButton: false,
            filterButton: false,
          }}
          search={
            <Search
              query={setSearch}
              reset={resetSearch}
              isDisabled={isLoading}
            />
          }
        />
        <div className={classes.tableBox}>
          <Table
            maw={widthTable}
            striped
            highlightOnHover
            horizontalSpacing="md"
            withColumnBorders
            withTableBorder
            className={classes.table}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={widthColumnFromCheckbox}>
                  <Checkbox
                    checked={isAllCheched}
                    indeterminate={indeterminate}
                    onChange={() => {
                      dispatch(setAllChecked());
                    }}
                    disabled={isLoading || !persons.length}
                  />
                </Table.Th>
                {thead}
                <Table.Th w={widthColumnFromActionButtons}>Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{!isLoading && rows}</Table.Tbody>
          </Table>
          {loader}
          {noData}
        </div>
        <div className={classes.flexGroup}>
          <TableInfoBlock
            entityTitle="персоналий"
            count={countPersons}
            checkedIds={checkedIds.length}
            resetAllChecked={resetAllChecked}
          />
          <Paginator
            count={countPersons}
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
        <FormSavePerson
          projects={projects}
          districts={districts}
          onClose={() => setIsOpenCreateForm(false)}
        />
      </Modal>

      <Modal
        title="Загрузить файл"
        opened={isOpenUploadFile}
        close={() => setIsOpenUploadFile(false)}
        size="md"
      >
        <UploadFilesForm
          fileType="excel"
          onClose={() => setIsOpenUploadFile(false)}
        >
          <Alert
            message="Прикрепите файл Excel с расширением .xls или .xlsx, размером не более 5 мегабайт, по форме, предложенной ниже."
            type="info"
            variant="light"
            disabledTitle={true}
          >
            <Anchor
              size="sm"
              onClick={() =>
                exportToExcel(
                  [],
                  headerForUploadPersonsForm,
                  [],
                  true,
                  "import_persons_form"
                )
              }
            >
              Форма для загрузки персоналий
            </Anchor>
          </Alert>
        </UploadFilesForm>
      </Modal>

      <Modal
        title="Редактировать запись"
        opened={isOpenUpdateForm}
        close={() => {
          setIsOpenUpdateForm(false);
          setPersonId(null);
        }}
        size="lg"
      >
        <FormSavePerson
          dataToUpdate={personData}
          projects={projects}
          districts={districts}
          onClose={() => setIsOpenUpdateForm(false)}
        />
      </Modal>

      <Modal
        title="Подтверждение действия"
        opened={isOpenConfirmAction}
        close={() => {
          setIsOpenConfirmAction(!isOpenConfirmAction);
          setPersonId(null);
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
            setPersonId(null);
          }}
          onClickToDelete={() => personId && dispatch(deletePerson(personId))}
        />
      </Modal>

      <Modal
        title="Фильтры"
        opened={isOpenFiltersForm}
        close={() => setIsOpenFiltersForm(false)}
        size="lg"
      >
        <PersonsFiltersForm
          rolesData={personRoles}
          districtsData={districts}
          projectsData={projects}
          onClickFiltered={() => setIsOpenFiltersForm(false)}
        />
      </Modal>
    </>
  );
};

export default PersonsTable;
