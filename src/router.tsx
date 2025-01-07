import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/layout/layout";
import {
  AdminPage,
  MailingPage,
  NotFoundPage,
  PersonsPage,
  ProjectsPage,
  SettingsPage,
} from "./pages";

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
          element: <AdminPage />,
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

export function Router() {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  );
}
