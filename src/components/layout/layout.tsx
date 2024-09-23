import { AppShell, Burger, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet, useLocation } from "react-router-dom";
import { ColorSchemeToggle } from "../color-sheme-toggle/color-sheme-toggle";
import { Dashboard } from "../../pages/dashboard/dashboard.page";
import { Navbar } from "../navbar/navbar";

import classes from "./layout.module.css";

export const Layout = () => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const content = useLocation().pathname === "/" ? <Dashboard /> : <Outlet />;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
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
            <Group ml="xl" gap={12} visibleFrom="sm">
              <ColorSchemeToggle />
            </Group>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>{content}</AppShell.Main>
    </AppShell>
  );
};
