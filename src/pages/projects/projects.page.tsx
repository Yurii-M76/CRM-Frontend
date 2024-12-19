import { Loader } from "@mantine/core";
import { lazy, Suspense } from "react";
const ProjectsTable = lazy(() => import("../../components/projects/projects-table"));
import classes from "../page.module.css";

export const ProjectsPage = () => {
  return (
    <>
      <h1 className={classes.pageTitle}>Проекты</h1>
      <Suspense fallback={<Loader color="blue" size={26} />}>
        <ProjectsTable />
      </Suspense>
    </>
  );
};
