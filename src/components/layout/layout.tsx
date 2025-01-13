import { AppShell, Box, Burger, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ColorSchemeToggle, Navbar, CRM_Notification } from "@components";
import { DashboardPage } from "@/pages/dashboard/dashboard.page";
import { useDispatch, useSelector } from "@/services/store";
import { getCookie } from "@/utils";
import { jwtDecode } from "jwt-decode";
import { getMe } from "@/services/user/action";
import { getMeData } from "@/services/user/reducer";
import classes from "./layout.module.css";

const Layout = () => {
  const dispatch = useDispatch();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const currentUser = useSelector(getMeData);
  const content =
    useLocation().pathname === "/" ? <DashboardPage /> : <Outlet />;

  useEffect(() => {
    const token = getCookie("accessToken");
    if (token) {
      const { sub } = jwtDecode(token);
      if (sub) {
        dispatch(getMe(sub));
      }
    }
  }, [dispatch]);

  return (
    <Box pos="relative" style={{ overflow: "hidden" }}>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 240,
          breakpoint: "sm",
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
            />
            <Group justify="space-between" style={{ flex: 1 }}>
              <Title order={3} className={classes.highlight}>
                CRM
              </Title>
              <Group ml="xl" gap={16}>
                <p>{currentUser && currentUser.name}</p>
                <ColorSchemeToggle />
              </Group>
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Navbar clickHandler={toggleMobile} />
        </AppShell.Navbar>
        <AppShell.Main>{content}</AppShell.Main>
      </AppShell>
      <CRM_Notification />
    </Box>
  );
};

export default Layout;