import { useDispatch, useSelector } from "@/services/store";
import { deleteUser, findAllUsers } from "@/services/users/actions";
import { getStatusUsers, getUsers } from "@/services/users/reducer";
import { Column, TUser } from "@/types";
import { Button, Switch, Table, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { ActionButtons } from "../table";
import { ButtonsFromDeleteForm, FormSaveUser } from "@components/forms";
import { Modal, Loader } from "@components";
import * as Icons from "@assets/icons";
import classes from "../table/table.module.css";

const columns: Column<TUser>[] = [
  { label: "Имя", accessor: "name", size: 200, sorted: true },
  { label: "Email", accessor: "email", size: 260, sorted: true },
  { label: "Роль", accessor: "role", size: 140, sorted: true },
  { label: "Активен", accessor: "isBlocked", size: 60, sorted: true },
];

const widthColumnFromActionButtons = 60;
const widthTable =
  columns.reduce((sum, column) => sum + column.size, 0) +
  widthColumnFromActionButtons;

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(getUsers);
  const status = useSelector(getStatusUsers);
  const [isOpenCreateForm, setIsOpenCreateForm] = useState<boolean>(false);
  // const [isOpenUpdateForm, setIsOpenUpdateForm] = useState<boolean>(false);
  const [isOpenConfirmAction, setIsOpenConfirmAction] =
    useState<boolean>(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  const thead = columns.map((column, index) => (
    <Table.Th w={column.size} key={index} className={classes.tableTh}>
      {column.label && (
        <Button.Group>
          <Button
            variant="light"
            color={column.sorted ? "blue" : "violet"}
            size="compact-sm"
            m={0}
            disabled={status.read.loading || !users.length}
          >
            {column.label}
          </Button>
        </Button.Group>
      )}
    </Table.Th>
  ));

  const rows =
    !status.read.loading &&
    users.map((item) => (
      <Table.Tr key={item.id}>
        <Table.Td>{item.name}</Table.Td>
        <Table.Td>{item.email}</Table.Td>
        <Table.Td>{item.role}</Table.Td>
        <Table.Td>
          <Switch checked={!item.isBlocked} color="green" />
        </Table.Td>
        <Table.Td>
          <ActionButtons
            handleClickFromEdit={() => ""}
            handleClickFromDelete={() => {
              setUserId(item.id);
              // setIsOpenConfirmAction(true);
            }}
          />
        </Table.Td>
      </Table.Tr>
    ));

  useEffect(() => {
    dispatch(findAllUsers());
  }, [dispatch]);

  useEffect(() => {
    setIsOpenCreateForm(false);
  }, [status.create.success]);

  useEffect(() => {
    setIsOpenConfirmAction(false);
  }, [status.delete.success]);

  return (
    <>
      <div className={classes.container} style={{ maxWidth: widthTable }}>
        <div className={classes.tableHeader}>
          <h2>Пользователи</h2>
          <Button
            variant="light"
            leftSection={<Icons.IconPlus className={classes.icon} />}
            onClick={() => setIsOpenCreateForm(true)}
          >
            Добавить
          </Button>
        </div>
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
          {status.read.loading && <Loader />}
        </div>
      </div>
      <Modal
        title="Новый пользователь"
        opened={isOpenCreateForm}
        close={() => setIsOpenCreateForm(false)}
        size="sm"
      >
        <FormSaveUser onClose={() => setIsOpenCreateForm(false)} />
      </Modal>

      <Modal
        title="Подтверждение действия"
        opened={isOpenConfirmAction}
        close={() => {
          setIsOpenConfirmAction(!isOpenConfirmAction);
          setUserId(undefined);
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
            setUserId(undefined);
          }}
          onClickToDelete={() => userId && dispatch(deleteUser(userId))}
        />
      </Modal>
    </>
  );
};

export default Users;
