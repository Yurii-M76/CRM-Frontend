import { useDispatch, useSelector } from "@/services/store";
import { getAllProjects } from "@/services/project/reducer";
import { findAllProjects } from "@/services/project/action";
import { useEffect } from "react";

export const Projects = () => {
  const dispatch = useDispatch();
  const projectsData = useSelector(getAllProjects);
  useEffect(() => {
    dispatch(findAllProjects());
  }, [dispatch]);

  console.log(projectsData)
  return "";
};
