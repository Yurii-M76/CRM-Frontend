import { Button, Checkbox, Pill, Table, Text } from "@mantine/core";
import { useEffect, useState } from "react";
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
import { dateFormatForTable } from "@/utils/date-format-for-table";
import { Column, TPerson } from "@/types";
import {
  ActionButtons,
  NoData,
  TableInfoBlock,
  THeadSortButton,
} from "@/components/table";
import { Paginator } from "@/components/paginator/paginator";
import { Loader } from "@/components/loader/loader";
import { CollapseList } from "@/components/collapse-list/collapse-list";
import { Modal } from "@/components/modal/modal";
import { DeleteModalButtons } from "@/components/buttons/delete-modal-buttons";
import { AddForm } from "../add-form/add-form";
import { findAllProjects } from "@/services/project/action";
import { getProjects } from "@/services/project/reducer";
import { PersonsTableToolbar } from "../toolbar/persons-table-toolbar";
import { personRoles } from "../person-roles";
import classes from "@components/table/table.module.css";

const columns: Column<TPerson>[] = [
  { label: "ФИО", accessor: "surname", size: 260, sorted: true },
  { label: "Телефон", accessor: "phone", size: 170, sorted: true },
  { label: "Дата рождения", accessor: "birthday", size: 180, sorted: true },
  { label: "E-Mail", accessor: "email", size: 200, sorted: true },
  { label: "Роль", accessor: "roles", size: 140, sorted: false },
  { label: "Проекты", accessor: "projects", size: 260, sorted: false },
  { label: "", accessor: "id", size: 100, sorted: false },
];

const widthTable = columns.reduce((sum, column) => sum + column.size, 0) + 54;

export const PersonsTable = () => {
  const dispatch = useDispatch();
  const status = useSelector(getPersonsStatus);
  const persons = useSelector(getPersons);
  const projects = useSelector(getProjects);
  const sortBy = useSelector(getSortBy);
  const sortOrder = useSelector(getSortOrder);
  const checkedIds = useSelector(getOneChecked);
  const countPersons = useSelector(getCountPersons);
  const rowsOnPage = useSelector(getRangeOnPage);
  const [isOpenModalAddForm, setIsOpenModalAddForm] = useState(false);
  const [isOpenModalToDelete, setIsOpenModalToDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const isLoading = status.read.loading;
  const loader = isLoading && <Loader />;
  const noData = !isLoading && !persons.length && <NoData />;

  const confirmActionModal = (
    <Modal
      title="Подтверждение действия"
      opened={isOpenModalToDelete}
      close={() => setIsOpenModalToDelete(!isOpenModalToDelete)}
      closeButton={false}
      size="md"
    >
      <Text>
        Вы уверены, что хотите удалить запись? Это действие нельзя отменить.
      </Text>
      <DeleteModalButtons
        loading={status.delete.loading}
        onClickToCancel={() => {
          setIsOpenModalToDelete(false);
          setIdToDelete(null);
        }}
        onClickToDelete={() => idToDelete && dispatch(deletePerson(idToDelete))}
      />
    </Modal>
  );

  const addFormModal = (
    <Modal
      title="Новый персоналий"
      opened={isOpenModalAddForm}
      close={() => setIsOpenModalAddForm(!isOpenModalAddForm)}
      size="lg"
    >
      <AddForm
        projects={projects}
        onClose={() => setIsOpenModalAddForm(false)}
      />
    </Modal>
  );

  const onClickFromEdit = (id: string) => {
    console.log("edit " + id);
  };

  const onClickFromDelete = (id: string) => {
    setIsOpenModalToDelete(true);
    setIdToDelete(id);
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
            onClick={() => column.sorted && sortedColumn(column.accessor)}
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
        <Table.Td>
          {item.surname} {item.name} {item.patronymic}
        </Table.Td>
        <Table.Td>{item.phone ?? "-"}</Table.Td>
        <Table.Td>{dateFormatForTable(item.birthday) ?? "-"}</Table.Td>
        <Table.Td>{item.email ?? "-"}</Table.Td>
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
              {item.projects.map((item) => {
                return <li key={item.id}>{item.title}</li>;
              })}
            </ul>
          </CollapseList>
        </Table.Td>
        <Table.Td>
          <ActionButtons
            handleClickFromEdit={() => onClickFromEdit(item.id)}
            handleClickFromDelete={() => onClickFromDelete(item.id)}
          />
        </Table.Td>
      </Table.Tr>
    ));

  useEffect(() => {
    dispatch(getAllPersons());
    dispatch(findAllProjects());
  }, [dispatch]);

  useEffect(() => {
    if (status.create.success) {
      setIsOpenModalAddForm(false);
    }
    if (status.delete.success) {
      setIsOpenModalToDelete(false);
    }
  }, [status.create.success, status.delete.success]);

  return (
    <>
      <div className={classes.container} style={{ maxWidth: widthTable }}>
        <PersonsTableToolbar
          isLoading={isLoading}
          isDisabled={!persons.length}
          openedAddForm={() => setIsOpenModalAddForm(true)}
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
            entityTitle="волонтеров"
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
      {addFormModal}
      {confirmActionModal}
    </>
  );
};
