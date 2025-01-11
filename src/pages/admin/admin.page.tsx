import { Button, Loader } from "@mantine/core";
import { lazy, Suspense } from "react";
import { getCookie, refreshTokens } from "@/utils";
const DistrictsTable = lazy(() => import("../../components/districts/districts-table"));
import classes from "../page.module.css";

export const AdminPage = () => {
  const handleClick = () => {
    const token = getCookie("refreshToken")
    console.log(token)
    refreshTokens()
  }
  return (
    <>
      <h1 className={classes.pageTitle}>Панель администратора</h1>

      <Button variant="outline" color="grape" onClick={handleClick}>test refresh token</Button><br /><br />

      <Suspense fallback={<Loader color="blue" size={26} />}>
        <div className={classes.pageSection}>
          <h2>Пользователи</h2>
          Список пользователей (добавить / редатировать / удалить)
        </div>

        <div className={classes.pageSection}>
          <h2>Персоналии</h2>
          Список ролей (добавить / редатировать / удалить)
        </div>

        <div className={classes.pageSection}>
          <DistrictsTable />
        </div>
      </Suspense>
    </>
  );
};
