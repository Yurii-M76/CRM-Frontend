import {
  Table,
  Checkbox,
  Group,
  Flex,
  Box,
  ActionIcon,
  Input,
  CloseButton,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { dataSlice } from "../../utils/data-slice";
import { Column, Person } from "./types";
import volonteers from "./mockData.json";
import SortedIcon from "./sorted-icon";
import { CRM_Pagination } from "../pagination/pagination";
import classes from "./volunteers.module.css";
import { Form } from "react-router-dom";

export const VolonteersTable = () => {
  const [data, setData] = useState<Person[]>(volonteers);

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("");

  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [isCheckedAll, setIsCheckedAll] = useState(false);

  const [activePage, setPage] = useState(1);
  const [rangeOnPage, setRangeOnPage] = useState(25);

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (!searchValue.length) {
      setData(volonteers);
    } else {
      const serchResult = [...volonteers].filter((elem) => {
        return (
          elem.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          elem.birthday.toLowerCase().includes(searchValue.toLowerCase()) ||
          elem.city.toLowerCase().includes(searchValue.toLowerCase()) ||
          elem.phone.toLowerCase().includes(searchValue.toLowerCase())
        );
      });

      setData(serchResult);
    }
  }, [data, searchValue]);

  const columns: Column[] = [
    { label: "№", accessor: "id", sorted: true },
    { label: "ФИО", accessor: "name", sorted: true },
    { label: "Дата рождения", accessor: "birthday", sorted: true },
    { label: "Город", accessor: "city", sorted: true },
    { label: "Телефон", accessor: "phone", sorted: true },
  ];

  const handleCheckedOne = (id: number) => {
    if (checkedIds.has(id)) {
      checkedIds.delete(id);
    } else {
      checkedIds.add(id);
    }
    setCheckedIds(new Set(checkedIds));
  };

  const handleCheckedAll = () => {
    if (isCheckedAll) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(data.map((person) => person.id)));
    }
    setIsCheckedAll(!isCheckedAll);
  };

  // Статус чекбокса в шапке колонки
  const indeterminate = checkedIds.size > 0 && checkedIds.size < data.length;

  const sortedColumn = (key: keyof Person) => {
    setSortBy(key);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");

    const sortedData = data.sort((a, b) => {
      if (sortOrder === "asc") {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
    setData(sortedData);
  };

  const handleClearSearchForm = () => {
    setSearchValue("");
  };

  const rows = dataSlice(data, activePage, rangeOnPage).map((element) => (
    <Table.Tr
      key={element.id}
      className={`${classes.rows} ${
        checkedIds.has(element.id) && classes.rows_select
      }`}
    >
      <Table.Td>
        <Checkbox
          checked={checkedIds.has(element.id)}
          onChange={() => handleCheckedOne(element.id)}
        />
      </Table.Td>
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.birthday}</Table.Td>
      <Table.Td>{element.city}</Table.Td>
      <Table.Td>{element.phone}</Table.Td>
      <Table.Td>
        <Flex gap="xs" justify="center" align="center" direction="row" w="100%">
          <ActionIcon
            variant="light"
            aria-label="Edit"
            radius="xl"
            className={classes.icon_action_edit}
          >
            <IconEdit style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            aria-label="Delete"
            color="red"
            radius="xl"
            className={classes.icon_action_remove}
          >
            <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Group gap={30}>
      <Form>
        <Input
          placeholder="Найти..."
          miw="340px"
          value={searchValue}
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          rightSectionPointerEvents="all"
          rightSection={
            <CloseButton
              aria-label="Поиск"
              onClick={handleClearSearchForm}
              style={{ display: searchValue ? undefined : "none" }}
            />
          }
        />
      </Form>

      <Box style={{ overflow: "auto", width: "100%" }}>
        <Table verticalSpacing="6px">
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
                <Table.Th
                  key={index}
                  className={classes.thead}
                  onClick={() => column.sorted && sortedColumn(column.accessor)}
                >
                  <span className={classes.column_name}>
                    {column.label}
                    <SortedIcon
                      sortBy={sortBy}
                      column={column}
                      sortOrder={sortOrder}
                    />
                  </span>
                </Table.Th>
              ))}
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Box>

      <Flex justify="space-between" align="center" direction="row" w="100%">
        Всего строк: {data.length} / Выбрано: {checkedIds.size}
        <CRM_Pagination
          activePage={activePage}
          dataLenght={data.length}
          rangeOnPage={rangeOnPage}
          setPage={setPage}
          setRangeOnPage={setRangeOnPage}
        />
      </Flex>
    </Group>
  );
};
