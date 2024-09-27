import { Button, Group, Select } from "@mantine/core";

export const Filters = () => {
  return (
    <Group justify="flex-end">
      <Button variant="light">Кнопка</Button>
      <Select
        placeholder="Выбрать..."
        data={["Выборка 1", "Выборка 2", "Выборка 3", "Выборка 4"]}
        clearable
      />
    </Group>
  );
};
