import { Loader } from "@mantine/core";
import { Suspense } from "react";
// const Settings = lazy(() => import(""));

export const SettingsPage = () => {
  return (
    <Suspense fallback={<Loader color="blue" size={26} />}>Settings</Suspense>
  );
};
