import { Loader } from "@mantine/core";
import { lazy, Suspense } from "react";
const PersonsTable = lazy(() => import("../../components/persons/table/persons-table"));
import classes from "../page.module.css";

export const PersonsPage = () => {
  return (
    <>
      <h1 className={classes.pageTitle}>Персоналии</h1>
      <Suspense fallback={<Loader color="blue" size={26} />}>
        <PersonsTable />
      </Suspense>
    </>
  );
};
