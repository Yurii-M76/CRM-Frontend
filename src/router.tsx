import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/layout/layout";
import { Volunteers } from "./pages/volunteers/volunteers.page";
import { Mailing } from "./pages/mailing/mailing.page";
import { Settings } from "./pages/settings/settings.page";
import { Modal } from "./components/modal/modal";
import { NotFound } from "./pages/not-found/not-found.page";
import { Login } from "./pages/login/login.page";
import { getIsAuthChecked } from "./services/user/reducer";
import { useSelector } from "./services/store";
import { Projects } from "./pages/projects/projects.page";

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
        element: <Projects />,
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
]);

export function Router() {
  const isAuthenticated = useSelector(getIsAuthChecked);

  if (isAuthenticated) {
    return <RouterProvider router={router} />;
  } else {
    return <Login />;
  }
}
