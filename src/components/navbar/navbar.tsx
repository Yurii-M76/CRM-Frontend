import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Divider } from "@mantine/core";
import { useDispatch } from "@/services/store";
import { logout } from "@/services/user/action";
import * as Icons from "../../assets/icons"
import classes from "./Navbar.module.css";

const tabs = [
  { link: "/", label: "Dashboard", icon: <Icons.IconHome /> },
  { link: "persons", label: "Персоналии", icon: <Icons.IconPersons /> },
  { link: "projects", label: "Проекты", icon: <Icons.IconCalendarEvent /> },
  { link: "mailing", label: "Рассылки", icon: <Icons.IconMail /> },
  { link: "settings", label: "Настройки", icon: <Icons.IconSettings /> },
];

const adminTabs = [
  {
    link: "admin-page",
    label: "Панель администратора",
    icon: <Icons.IconIconAdjustmentsAlt />,
  },
];

export function Navbar() {
  const location = useLocation().pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const links = tabs.map((item) => (
    <Link
      to={item.link}
      className={classes.link}
      data-active={
        location === "/" + (item.link === "/" ? "" : "/") ||
        location === "/" + item.link ||
        undefined
      }
      key={item.label}
    >
      <span className={classes.linkIcon}>{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  ));

  const adminLinks = adminTabs.map((item) => (
    <Link
      to={item.link}
      className={classes.link}
      data-active={location === "/" + item.link || undefined}
      key={item.label}
    >
      <span className={classes.linkIcon}>{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <>
      <div className={classes.navbarMain}>
        {links}
        <Divider mt={10} mb={10} />
        {adminLinks}
      </div>

      <div className={classes.footer}>
        <Button fullWidth variant="light" color="red" onClick={handleLogout}>
          Выйти
        </Button>
      </div>
    </>
  );
}
