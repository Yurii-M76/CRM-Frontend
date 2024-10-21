import { Button, Divider, Group, TextInput } from "@mantine/core";
import classes from "./add-form.module.css";

export const AddForm = () => {
  return (
    <div className={classes.form}>
      <Group gap={4} justify="space-between">
        <TextInput placeholder="Фамилия" />
        <TextInput placeholder="Имя" />
        <TextInput placeholder="Отчество" />
      </Group>

      <TextInput placeholder="Дата рождения" />
      <TextInput placeholder="Город" />
      <TextInput placeholder="Телефон" />
      <Divider my="md" />
      <Button>Добавить</Button>
    </div>
  );
};
