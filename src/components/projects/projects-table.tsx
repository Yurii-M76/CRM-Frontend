import { Button, LoadingOverlay, Table } from "@mantine/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "@/services/store";
import { findAllProjects } from "@/services/project/action";
import { getAllProjects } from "@/services/project/reducer";
import { Column, TProject } from "@/types";
import { getSortOrder, resetSort } from "@/services/volunteer/reducer";
import { VolunteersListForTables } from "../lists-of-cells-for-tables/volunteers-list-for-tables";
import { ProjectsTableToolbar } from ".";
import { ActionButtons, THeadSortButton, NoData } from "@components/table";
import classes from "../table/table.module.css";

const columns: Column<TProject>[] = [
  { label: "Название", accessor: "title", size: 200, sorted: true },
  { label: "Описание", accessor: "describe", size: 400, sorted: true },
  { label: "Участники", accessor: "volunteers", size: 300, sorted: true },
];
const widthTable = columns.reduce((sum, column) => sum + column.size, 0);
// const sortedColumn = (sortBy: keyof TProject) => {
// dispatch(
//   setSort({
//     sortBy: sortBy,
//     sortOrder: sortOrder === "asc" ? "desc" : "asc",
//   })
// );
// };

export const ProjectsTable = () => {
  const dispatch = useDispatch();
  const projectsData = useSelector(getAllProjects);
  const sortOrder = useSelector(getSortOrder);
  useEffect(() => {
    dispatch(findAllProjects());
  }, [dispatch]);

  const rows = projectsData.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>{item.title}</Table.Td>
      <Table.Td>{item.describe}</Table.Td>
      <Table.Td>
        <VolunteersListForTables data={item.volunteers} />
      </Table.Td>
      <Table.Td>
        <ActionButtons />
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <div
      className={classes.container}
      style={{ maxInlineSize: `${widthTable + 300}px`, minInlineSize: "350px" }}
    >
      <LoadingOverlay visible={false} />
      <ProjectsTableToolbar />
      <div className={classes.tableBox}>
        <Table
          maw={widthTable + 250}
          highlightOnHover
          horizontalSpacing="md"
          verticalSpacing="10px"
          withColumnBorders
          className={classes.table}
        >
          <Table.Thead>
            <Table.Tr>
              {columns.map((column, index) => (
                <Table.Th
                  miw={column.size}
                  maw={column.size}
                  key={index}
                  className={classes.tableTh}
                >
                  <div className={classes.column_name}>
                    <Button.Group>
                      <Button
                        variant="light"
                        color="blue"
                        size="compact-sm"
                        // onClick={() =>
                        //   column.sorted && sortedColumn(column.accessor)
                        // }
                      >
                        {column.label}
                      </Button>
                      <THeadSortButton
                        accessor={column.accessor}
                        sortBy=""
                        sortOrder={sortOrder}
                        resetSort={() => dispatch(resetSort())}
                      />
                    </Button.Group>
                  </div>
                </Table.Th>
              ))}
              <Table.Th w={100}>{/*actions*/}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        {!projectsData.length && <NoData />}
      </div>
      <div className={classes.flexGroup}>
        <div className={classes.info}>info</div>
        <div className={classes.pagination}>pagination</div>
      </div>
    </div>
  );
};
