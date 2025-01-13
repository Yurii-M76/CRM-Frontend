import { Loader, Paper } from "@mantine/core";
import { lazy, Suspense } from "react";

const Users = lazy(() =>
  import("@components").then((module) => ({ default: module.Users }))
);
const DistrictsTable = lazy(() =>
  import("@components").then((module) => ({ default: module.DistrictsTable }))
);

import classes from "../page.module.css";

export const AdminPage = () => {
  const loader = <div>Загрузка...</div>;
  return (
    <>
      <h1 className={classes.pageTitle}>Панель администратора</h1>

      <Suspense fallback={<Loader color="blue" size={26} />}>
        <div className={classes.pageSection}>
          <Paper shadow="xs" p="md" withBorder>
            <Suspense fallback={loader}>
              <Users />
            </Suspense>
          </Paper>
        </div>
        <div className={classes.pageSection}>
          <Paper shadow="xs" p="md" withBorder>
            <Suspense fallback={loader}>
              <DistrictsTable />
            </Suspense>
          </Paper>
        </div>
      </Suspense>
    </>
  );
};
