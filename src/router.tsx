import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/layout/layout";
import { Modal } from "./components/modal/modal";
import { getIsAuthChecked } from "./services/user/reducer";
import { useSelector } from "./services/store";
import {
  Login,
  Mailing,
  NotFound,
  Projects,
  Settings,
  Volunteers,
} from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/volunteers",
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
