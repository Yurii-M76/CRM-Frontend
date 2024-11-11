import { Input } from "@mantine/core";
import { Form } from "react-router-dom";

export const Search = () => {
  return (
    <Form>
      <Input
        placeholder="Найти..."
        miw="340px"
        rightSectionPointerEvents="all"
      />
    </Form>
  );
};
