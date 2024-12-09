import { DistrictsTable } from "@/components/districts/districts-table";
import classes from "../page.module.css";

export const AdminPage = () => {
  return (
    <>
      <h1 className={classes.pageTitle}>Панель администратора</h1>

      <div className={classes.pageSection}>
        <h2>Персоналии</h2>
        Список ролей (добавить / редатировать / удалить)
      </div>

      <div className={classes.pageSection}>
        <DistrictsTable />
      </div>
    </>
  );
};
