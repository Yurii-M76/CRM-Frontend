import { List } from "@mantine/core";
import exceptions from "@/constants/exceptions";

export const validationErrorMessagesList = (errors: string[]) => {
  const uniqueErrors = new Set(errors);
  return (
    <List size="xs">
      {Array.from(uniqueErrors).map((error, index) => (
        <List.Item key={index}>{error}</List.Item>
      ))}
    </List>
  );
};

export const validationSurname = (value: string) => {
  const errors: string[] = [];
  if (!value) return null;
  if (/[^\p{L}\s-]/u.test(value))
    errors.push(exceptions.persons.formValidate.surname.cyrillicOnly);
  if (/[A-z]+/.test(value))
    errors.push(exceptions.persons.formValidate.surname.cyrillicOnly);
  if (!/^.{2,}$/.test(value))
    errors.push(exceptions.persons.formValidate.surname.moreLetters);
  if (/[А-яЁё-]+\s[А-яЁё-]+/.test(value))
    errors.push(exceptions.persons.formValidate.surname.noSpaces);
  return errors.length ? validationErrorMessagesList(errors) : null;
};

export const validationName = (value: string) => {
  const errors: string[] = [];
  if (!value) return exceptions.persons.formValidate.requiredField;
  if (/[^\p{L}\s-]/u.test(value))
    errors.push(exceptions.persons.formValidate.name.cyrillicOnly);
  if (/[A-z]+/.test(value))
    errors.push(exceptions.persons.formValidate.name.cyrillicOnly);
  if (!/^.{2,}$/.test(value))
    errors.push(exceptions.persons.formValidate.name.moreLetters);
  if (/[А-яЁё-]+\s[А-яЁё-]+/.test(value))
    errors.push(exceptions.persons.formValidate.name.noSpaces);
  return errors.length ? validationErrorMessagesList(errors) : null;
};

export const validationPatronymic = (value: string) => {
  const errors: string[] = [];
  if (!value) return null;
  if (/[^\p{L}\s-]/u.test(value))
    errors.push(exceptions.persons.formValidate.patronymic.cyrillicOnly);
  if (/[A-z]+/.test(value))
    errors.push(exceptions.persons.formValidate.patronymic.cyrillicOnly);
  if (!/^.{5,}$/.test(value))
    errors.push(exceptions.persons.formValidate.patronymic.moreLetters);
  if (/[А-яЁё-]+\s[А-яЁё-]+/.test(value))
    errors.push(exceptions.persons.formValidate.patronymic.noSpaces);
  return errors.length ? validationErrorMessagesList(errors) : null;
};

export const validationPhone = (value: string) => {
  const errors: string[] = [];
  if (!value) return exceptions.persons.formValidate.requiredField;
  if (!/^.{18}$/.test(value))
    errors.push(exceptions.persons.formValidate.invalidInput);
  return errors.length ? validationErrorMessagesList(errors) : null;
}

export const validationEmail = (value: string) => {
  const errors: string[] = [];
  if (!value) return null;
  if (!/^\S+@\S{2,}\.\S{2,}$/.test(value))
    errors.push(exceptions.persons.formValidate.invalidInput);
  return errors.length ? validationErrorMessagesList(errors) : null;
}