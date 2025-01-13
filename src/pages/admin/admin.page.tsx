import { Loader } from "@mantine/core";
import { lazy, Suspense } from "react";

const Users = lazy(() => import("@components").then((module) => ({ default: module.Users })));
const DistrictsTable = lazy(() => import("@components").then((module) => ({ default: module.DistrictsTable })));

import classes from "../page.module.css";

export const AdminPage = () => {
  const loader = <div>Загрузка...</div>;
  return (
    <>
      <h1 className={classes.pageTitle}>Панель администратора</h1>

      <Suspense fallback={<Loader color="blue" size={26} />}>
        <div className={classes.pageSection}>
          <h2>Пользователи</h2>
          <Suspense fallback={loader}>
            <Users />
          </Suspense>
        </div>

        <div className={classes.pageSection}>
          <h2>Персоналии</h2>
          Список ролей (добавить / редатировать / удалить)
        </div>

        <div className={classes.pageSection}>
          <Suspense fallback={loader}>
            <DistrictsTable />
          </Suspense>
        </div>
      </Suspense>
    </>
  );
};
