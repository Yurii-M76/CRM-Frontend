import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@components";
import {
  AdminPage,
  MailingPage,
  NotFoundPage,
  PersonsPage,
  ProjectsPage,
  SettingsPage,
} from "./pages";
import { useSelector } from "./services/store";
import { getMeData } from "./services/user/reducer";

export function Router() {
  const user = useSelector(getMeData);
  const isAdmin = user?.role === "ADMIN";
  const adminPage = isAdmin ? <AdminPage /> : "Ошибка 403. Доступ запрещен";

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "/persons",
            element: <PersonsPage />,
          },
          {
            path: "/projects",
            element: <ProjectsPage />,
          },
          {
            path: "/mailing",
            element: <MailingPage />,
          },
          {
            path: "/settings",
            element: <SettingsPage />,
          },
          {
            path: "/admin-page",
            element: adminPage,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
    {
      future: {
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_partialHydration: true,
        v7_normalizeFormMethod: true,
        v7_skipActionErrorRevalidation: true,
      },
    }
  );

  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  );
}
