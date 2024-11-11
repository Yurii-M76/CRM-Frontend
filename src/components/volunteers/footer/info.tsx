import { useSelector } from "@/services/store";
import { getCountVolunteers } from "@/services/volunteer/reducer";
import classes from "./footer.module.css";

export const Info = () => {
  const countVolunteers = useSelector(getCountVolunteers)

  return `Всего записей: ${countVolunteers} / На странице: 0 / Выбрано: 0`;
};
