import { Loader } from "@mantine/core";
import { Suspense } from "react";
// const Mailing = lazy(() => import(""));

export const MailingPage = () => {
  return (
    <Suspense fallback={<Loader color="blue" size={26} />}>Mailing</Suspense>
  );
};
