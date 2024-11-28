import { Center, Loader as MantineLoader } from "@mantine/core";

export const Loader = () => {
  return (
    <Center pt={20}>
      <MantineLoader size={30} />
    </Center>
  );
};
