import { Button, CloseButton, Flex, Group, Input, Select } from "@mantine/core";
import { FC, SyntheticEvent, useState } from "react";
import { Form } from "react-router-dom";
import { Person } from "./types";

type TFilters = {
  tableData: Person[];
  setTableData?: (array: Person[]) => void;
};

export const Filters: FC<TFilters> = ({ tableData }) => {
  const [value, setValue] = useState("");
  const handleSubmit = (event: SyntheticEvent) => {
    if (value) {
      event.preventDefault();
      console.log(value);
      const result = tableData.filter((element) =>
        element.name.includes(value)
      );
      console.log(result);
    }
  };

  return (
    <Flex
      gap="md"
      justify="space-between"
      align="center"
      direction="row"
      wrap="wrap"
      w="100%"
    >
      <Form onSubmit={handleSubmit}>
        <Input
          placeholder="Найти..."
          miw="340px"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          rightSectionPointerEvents="all"
          rightSection={
            <CloseButton
              aria-label="Поиск"
              onClick={() => setValue("")}
              style={{ display: value ? undefined : "none" }}
            />
          }
        />
      </Form>
      <Group justify="flex-end">
        <Button variant="light">Кнопка</Button>
        <Select
          placeholder="Выбрать..."
          data={["Выборка 1", "Выборка 2", "Выборка 3", "Выборка 4"]}
          clearable
        />
      </Group>
    </Flex>
  );
};
