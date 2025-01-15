import { useDispatch, useSelector } from "@/services/store";
import { findAllUsers } from "@/services/users/actions";
import { getIsLoadingUsers, getUsers } from "@/services/users/reducer";
import { Column, TUser } from "@/types";
import { Button, Switch, Table } from "@mantine/core";
import { useEffect } from "react";
import { ActionButtons } from "../table";
import { useDisclosure } from "@mantine/hooks";
import { FormSaveUser } from "@components/forms";
import Modal from "../modal/modal";
import * as Icons from "@assets/icons";
import classes from "../table/table.module.css";

const columns: Column<TUser>[] = [
  { label: "Имя", accessor: "name", size: 200, sorted: true },
  { label: "Email", accessor: "email", size: 200, sorted: true },
  { label: "Роль", accessor: "role", size: 140, sorted: true },
  { label: "Активен", accessor: "isBlocked", size: 60, sorted: true },
];

const widthColumnFromActionButtons = 60;
const widthTable =
  columns.reduce((sum, column) => sum + column.size, 0) +
  widthColumnFromActionButtons;

const Users = () => {
  const dispath = useDispatch();
  const users = useSelector(getUsers);
  const isLoading = useSelector(getIsLoadingUsers);
  const [opened, { open, close }] = useDisclosure(false);

  const thead = columns.map((column, index) => (
    <Table.Th w={column.size} key={index} className={classes.tableTh}>
      {column.label && (
        <Button.Group>
          <Button
            variant="light"
            color={column.sorted ? "blue" : "violet"}
            size="compact-sm"
            disabled={isLoading || !users.length}
          >
            {column.label}
          </Button>
        </Button.Group>
      )}
    </Table.Th>
  ));

  const rows =
    !isLoading &&
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
            handleClickFromDelete={() => ""}
          />
        </Table.Td>
      </Table.Tr>
    ));

  useEffect(() => {
    dispath(findAllUsers());
  }, [dispath]);

  return (
    <>
      <div className={classes.container} style={{ maxWidth: widthTable }}>
        <div className={classes.tableHeader}>
          <h2>Пользователи</h2>
          <Button
            variant="light"
            leftSection={<Icons.IconPlus className={classes.icon} />}
            onClick={open}
          >
            Добавить
          </Button>
        </div>
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
            <Table.Tbody>{!isLoading && rows}</Table.Tbody>
          </Table>
        </div>
      </div>
      <Modal title="Новый пользователь" opened={opened} close={close} size="sm">
        <FormSaveUser onClose={close} />
      </Modal>
    </>
  );
};

export default Users;
