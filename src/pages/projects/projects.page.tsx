import { ProjectsTable } from "@/components/projects"
import classes from "../page.module.css";

export const ProjectsPage = () => {
  return (
    <>
      <h1 className={classes.pageTitle}>Проекты</h1>
      <ProjectsTable />
    </>
  );
}