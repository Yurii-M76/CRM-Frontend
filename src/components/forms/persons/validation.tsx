import exceptions from "@/constants/exceptions";

export const validationErrorMessagesList = (errors: string[]) => {
  const uniqueErrors = new Set(errors);
  return Array.from(uniqueErrors).map((error) => error + ". ");
};

export const validationSurname = (value: string | undefined) => {
  const errors: string[] = [];
  if (!value) return undefined;
  if (/[^\p{L}\s-]/u.test(value))
    errors.push(exceptions.formValidate.persons.surname.cyrillicOnly);
  if (/[A-z]+/.test(value))
    errors.push(exceptions.formValidate.persons.surname.cyrillicOnly);
  if (!/^.{2,}$/.test(value))
    errors.push(exceptions.formValidate.persons.surname.moreLetters);
  if (/[А-яЁё-]+\s[А-яЁё-]+/.test(value))
    errors.push(exceptions.formValidate.persons.surname.noSpaces);
  return errors.length ? validationErrorMessagesList(errors) : undefined;
};

export const validationName = (value: string | undefined) => {
  const errors: string[] = [];
  if (!value) return exceptions.formValidate.all.requiredField;
  if (/[^\p{L}\s-]/u.test(value))
    errors.push(exceptions.formValidate.persons.name.cyrillicOnly);
  if (/[A-z]+/.test(value))
    errors.push(exceptions.formValidate.persons.name.cyrillicOnly);
  if (!/^.{2,}$/.test(value))
    errors.push(exceptions.formValidate.persons.name.moreLetters);
  if (/[А-яЁё-]+\s[А-яЁё-]+/.test(value))
    errors.push(exceptions.formValidate.persons.name.noSpaces);
  return errors.length ? validationErrorMessagesList(errors) : undefined;
};

export const validationPatronymic = (value: string | undefined) => {
  const errors: string[] = [];
  if (!value) return undefined;
  if (/[^\p{L}\s-]/u.test(value))
    errors.push(exceptions.formValidate.persons.patronymic.cyrillicOnly);
  if (/[A-z]+/.test(value))
    errors.push(exceptions.formValidate.persons.patronymic.cyrillicOnly);
  if (!/^.{5,}$/.test(value))
    errors.push(exceptions.formValidate.persons.patronymic.moreLetters);
  if (/[А-яЁё-]+\s[А-яЁё-]+/.test(value))
    errors.push(exceptions.formValidate.persons.patronymic.noSpaces);
  return errors.length ? validationErrorMessagesList(errors) : undefined;
};

export const validationPhone = (value: string | undefined) => {
  const errors: string[] = [];
  if (!value) return exceptions.formValidate.all.requiredField;
  if (!/^.{18}$/.test(value))
    errors.push(exceptions.formValidate.all.invalidInput);
  return errors.length ? validationErrorMessagesList(errors) : undefined;
};

export const validationEmail = (value: string | undefined) => {
  const errors: string[] = [];
  if (!value) return undefined;
  if (!/^\S+@\S{2,}\.\S{2,}$/.test(value))
    errors.push(exceptions.formValidate.all.invalidInput);
  return errors.length ? validationErrorMessagesList(errors) : undefined;
};
