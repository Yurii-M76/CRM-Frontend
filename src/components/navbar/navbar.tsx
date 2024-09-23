import { useEffect, useState } from "react";
import {
  IconSettings,
  IconLayoutDashboardFilled,
  IconError404,
  IconDatabase,
  IconMail,
  IconFolderOpen,
  IconCalendarEvent,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";
import classes from "./Navbar.module.css";
import { useDispatch, useSelector } from "../../services/store";
import { logout } from "../../services/user/action";
import { getIsAuthChecked } from "../../services/user/reducer";

const tabs = [
  { link: "/", label: "Dashboard", icon: IconLayoutDashboardFilled },
  { link: "database", label: "База данных", icon: IconDatabase },
  { link: "projects", label: "Проекты", icon: IconCalendarEvent },
  { link: "mailing", label: "Рассылки", icon: IconMail },
  { link: "settings", label: "Настройки", icon: IconSettings },
  { link: "modal", label: "Модалка", icon: IconFolderOpen },
  { link: "error", label: "Not found", icon: IconError404 },
];

export function Navbar() {
  const [active, setActive] = useState("Billing");

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const isAuthenticated = useSelector(getIsAuthChecked);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const links = tabs.map((item) => (
    <Link
      to={item.link}
      className={classes.link}
      data-active={item.label === active || undefined}
      key={item.label}
      onClick={() => {
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <>
      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <Button fullWidth variant="light" color="red" onClick={handleLogout}>
          Выйти
        </Button>
      </div>
    </>
  );
}
