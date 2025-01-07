import { Loader } from "@mantine/core";
import { Suspense } from "react";
// const Dashboard = lazy(() => import(""));

export function DashboardPage() {
  return (
    <Suspense fallback={<Loader color="blue" size={26} />}>Dashboard</Suspense>
  );
}
