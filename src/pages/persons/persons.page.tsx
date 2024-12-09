import { PersonsTable } from "@/components/persons/table/persons-table";
import classes from "../page.module.css";

export const PersonsPage = () => {
  return (
    <>
      <h1 className={classes.pageTitle}>Персоналии</h1>
      <PersonsTable />
    </>
  );
};
