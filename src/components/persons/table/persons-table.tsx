import { Button, Checkbox, Pill, Table, Text } from "@mantine/core";
import { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "@/services/store";
import { deletePerson, getAllPersons } from "@/services/person/action";
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
} from "@/services/person/reducer";
import { formatDateToString } from "@/utils/format-date";
import { Column, TPerson } from "@/types";
import {
  ActionButtons,
  NoData,
  TableInfoBlock,
  THeadSortButton,
} from "@/components/table";
import { Paginator } from "@/components/paginator/paginator";
import { Loader } from "@/components/loader/loader";
import { DeleteModalButtons } from "@/components/buttons/delete-modal-buttons";
import { findAllProjects } from "@/services/project/action";
import { getProjects } from "@/services/project/reducer";
import { personRoles } from "../person-roles";
import { getDistricts } from "@/services/districts/reducer";
import { getAllDistricts } from "@/services/districts/action";
import { FormSavePerson, PersonsTableToolbar } from "../";
const CollapseList = lazy(() => import("@/components/collapse-list/collapse-list"));
const Modal = lazy(() => import("@/components/modal/modal"));
import classes from "@components/table/table.module.css";

const columns: Column<TPerson>[] = [
  { label: "ФИО", accessor: "fullName", size: 260, sorted: true },
  { label: "Телефон", accessor: "phone", size: 170, sorted: true },
  { label: "Дата рождения", accessor: "birthday", size: 180, sorted: true },
  { label: "E-Mail", accessor: "email", size: 200, sorted: true },
  { label: "Роль", accessor: "roles", size: 140, sorted: false },
  { label: "Проекты", accessor: "projects", size: 260, sorted: true },
  { label: "Район", accessor: "districts", size: 210, sorted: false },
  { label: "", accessor: "id", size: 100, sorted: false },
];

const widthTable = columns.reduce((sum, column) => sum + column.size, 0) + 54;

export const PersonsTable = () => {
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
  const [isOpenCreateForm, setIsOpenCreateForm] = useState(false);
  const [isOpenUpdateForm, setIsOpenUpdateForm] = useState(false);
  const [isOpenConfirmAction, setIsOpenConfirmAction] = useState(false);
  const [personData, setPersonData] = useState<TPerson | undefined>(undefined);
  const [personId, setPersonId] = useState<string | null>(null);

  const isLoading = status.read.loading;
  const loader = isLoading && <Loader />;
  const noData = !isLoading && !persons.length && <NoData />;

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
    <Table.Th miw={column.size} key={index} className={classes.tableTh}>
      {column.label && (
        <Button.Group>
          <Button
            variant={"light"}
            color={column.sorted ? "blue" : "violet"}
            size="compact-sm"
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
        <Table.Td>{item.phone}</Table.Td>
        <Table.Td>
          {item.birthday
            ? formatDateToString(new Date(item.birthday), "asc")
            : "-"}
        </Table.Td>
        <Table.Td>{item.email || "-"}</Table.Td>
        <Table.Td>
          {item.roles.map((role, index) => (
            <Pill key={index} mr={4}>
              {PersonRoleLocale(role)}
            </Pill>
          ))}
        </Table.Td>
        <Table.Td>
          <CollapseList totalItems={item.projects.length}>
            <ul>
              {item.projects.length
                ? item.projects.map((item) => {
                    return <li key={item.id}>{item.title}</li>;
                  })
                : "-"}
            </ul>
          </CollapseList>
        </Table.Td>
        <Table.Td>{item.districts.map((district) => district.name)}</Table.Td>
        <Table.Td>
          <ActionButtons
            handleClickFromEdit={() => updateClickHandler(item.id)}
            handleClickFromDelete={() => deleteClickHandler(item.id)}
          />
        </Table.Td>
      </Table.Tr>
    ));

  useEffect(() => {
    dispatch(getAllPersons());
    dispatch(findAllProjects());
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
        <PersonsTableToolbar
          isLoading={isLoading}
          isDisabled={!persons.length}
          openedAddForm={() => setIsOpenCreateForm(true)}
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
                <Table.Th>
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
        <DeleteModalButtons
          loading={status.delete.loading}
          onClickToCancel={() => {
            setIsOpenConfirmAction(false);
            setPersonId(null);
          }}
          onClickToDelete={() => personId && dispatch(deletePerson(personId))}
        />
      </Modal>
    </>
  );
};

export default PersonsTable;