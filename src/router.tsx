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

const router = createBrowserRouter([
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
]);

export function Router() {
  return <RouterProvider router={router} />;
}
