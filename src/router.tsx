import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/layout/layout";
import { Volunteers } from "./pages/volunteers/volunteers.page";
import { Mailing } from "./pages/mailing/mailing.page";
import { Settings } from "./pages/settings/settings.page";
import { Modal } from "./components/modal/modal";
import { NotFound } from "./pages/not-found/not-found.page";
import { Login } from "./pages/login/login.page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/database",
        element: <Volunteers />,
      },
      {
        path: "/projects",
        element: "Projects",
      },
      {
        path: "/mailing",
        element: <Mailing />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/modal",
        element: <Modal />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
