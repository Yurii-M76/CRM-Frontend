import { Table, Checkbox, Group, Flex, Box, ActionIcon } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { dataSlice } from "../../utils/data-slice";
import { Filters } from "./filters";
import { Footer } from "./footer";
import { Column, Person } from "./types";
import data from "./mockData.json";

import classes from "./volunteers.module.css";

export const VolonteersTable = () => {
  const [tableData, setTableData] = useState<Person[]>(data);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [activePage, setPage] = useState(1);
  const [rangeOnPage, setRangeOnPage] = useState(25);

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("");

  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());

  const sortedColumn = (key: keyof Person) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }

    const sortedData = tableData.sort((a, b) => {
      if (sortOrder === "asc") {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
    setTableData(sortedData);
  };

  const columns: Column[] = [
    { label: "№", accessor: "id", sorted: true },
    { label: "ФИО", accessor: "name", sorted: true },
    { label: "Дата рождения", accessor: "birthday", sorted: true },
    { label: "Город", accessor: "city", sorted: true },
    { label: "Телефон", accessor: "phone", sorted: true },
  ];

  const handleChange = (id: number) => {
    if (checkedIds.has(id)) {
      checkedIds.delete(id);
    } else {
      checkedIds.add(id);
    }
    setCheckedIds(new Set(checkedIds));
    console.log(checkedIds);
  };

  const handleChangeAll = () => {
    if (isCheckedAll) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(tableData.map((person) => person.id)));
    }
    setIsCheckedAll(!isCheckedAll);
  };

  const indeterminate =
    checkedIds.size > 0 && checkedIds.size < tableData.length;

  const rows = dataSlice(tableData, activePage, rangeOnPage).map((element) => (
    <Table.Tr
      key={element.id}
      className={`${classes.rows} ${
        checkedIds.has(element.id) && classes.rows_select
      }`}
    >
      <Table.Td>
        <Checkbox
          checked={checkedIds.has(element.id)}
          onChange={() => handleChange(element.id)}
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
      <Filters tableData={tableData} />
      <Box style={{ overflow: "auto", width: "100%" }}>
        <Table verticalSpacing="6px">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox
                  checked={isCheckedAll}
                  indeterminate={indeterminate}
                  onChange={handleChangeAll}
                />
              </Table.Th>
              {columns.map((column, index) => (
                <Table.Th
                  key={index}
                  className={classes.thead}
                  onClick={() => column.sorted && sortedColumn(column.accessor)}
                >
                  {column.label}
                </Table.Th>
              ))}
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Box>

      <Footer
        tableData={tableData}
        rangeOnPage={rangeOnPage}
        activePage={activePage}
        setPage={setPage}
        setRangeOnPage={setRangeOnPage}
        rowsSelect={checkedIds.size}
        totalRows={tableData.length}
      />
    </Group>
  );
};
