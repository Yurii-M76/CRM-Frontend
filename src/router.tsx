import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/layout/layout";
import { Mailing, NotFound, Projects, Settings, Volunteers } from "./pages";

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
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
