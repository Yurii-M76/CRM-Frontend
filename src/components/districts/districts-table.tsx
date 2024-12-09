import { Button, Table } from "@mantine/core";
import { TDistrict } from "@/types/district.types";
import { Column } from "@/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "@/services/store";
import { getAllDistricts } from "@/services/districts/action";
import { getDistricts, getDistrictsStatus } from "@/services/districts/reducer";
import { ActionButtons } from "../table";
import { Loader } from "../loader/loader";
import { IconPlus } from "@tabler/icons-react";
import classes from "../table/table.module.css";

const columns: Column<TDistrict & { index: number; actions: number }>[] = [
  { label: "#", accessor: "index", size: 60 },
  { label: "Наименование района", accessor: "name", size: 400 },
  { label: "Действия", accessor: "actions", size: 100 },
];
const widthTable = columns.reduce((sum, column) => sum + column.size, 0) + 2;

export const DistrictsTable = () => {
  const dispatch = useDispatch();
  const status = useSelector(getDistrictsStatus);
  const districts = useSelector(getDistricts);
  const isLoading = status.read.loading;

  const thead = columns.map((column, index) => (
    <Table.Th
      miw={column.size}
      maw={column.size}
      key={index}
      className={classes.tableTh}
    >
      {column.label}
    </Table.Th>
  ));

  const rows = districts.map((item, index) => (
    <Table.Tr key={item.id}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{item.name}</Table.Td>
      <Table.Td>
        <ActionButtons
          handleClickFromEdit={() => ""}
          handleClickFromDelete={() => ""}
        />
      </Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    dispatch(getAllDistricts());
  }, [dispatch]);

  return (
    <>
      <div
        className={classes.tableHeader}
        style={{ maxWidth: widthTable }}
      >
        <h2>Районы</h2>
        <Button variant="light" leftSection={<IconPlus size={14} />}>
          Добавить
        </Button>
      </div>

      <div className={classes.tableBox} style={{ maxWidth: widthTable }}>
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
            <Table.Tr>{thead}</Table.Tr>
          </Table.Thead>

          <Table.Tbody>{!isLoading && rows}</Table.Tbody>
        </Table>
        {isLoading && <Loader />}
      </div>
    </>
  );
};
