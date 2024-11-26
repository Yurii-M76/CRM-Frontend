import { Blockquote, Center } from "@mantine/core";

export const NoData = () => {
  return (
    <Blockquote color="gray" mt={20} p={12} mb={0}>
      <Center>нет данных</Center>
    </Blockquote>
  );
};
