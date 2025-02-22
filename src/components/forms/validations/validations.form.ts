import exceptions from "@/constants/exceptions";

export const validationErrorMessagesList = (errors: string[]) => {
  const uniqueErrors = new Set(errors);
  return Array.from(uniqueErrors).map((error) => error + ". ");
};

export const validationSurname = (
  value: string | undefined,
  isRequired?: boolean
) => {
  if (isRequired && !value) return exceptions.formValidate.all.requiredField;
  if (!value) return undefined;
  const errors: string[] = [];
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

export const validationName = (
  value: string | undefined,
  isRequired?: boolean
) => {
  if (isRequired && !value) return exceptions.formValidate.all.requiredField;
  if (!value) return undefined;
  const errors: string[] = [];
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

export const validationPatronymic = (
  value: string | undefined,
  isRequired?: boolean
) => {
  if (isRequired && !value) return exceptions.formValidate.all.requiredField;
  if (!value) return undefined;
  const errors: string[] = [];
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

export const validationPhone = (
  value: string | undefined,
  length: number,
  isRequired?: boolean
) => {
  if (isRequired && !value) return exceptions.formValidate.all.requiredField;
  if (!value) return undefined;
  const errors: string[] = [];
  const regex = new RegExp(`^.{${length}}$`);
  if (!regex.test(value)) errors.push(exceptions.formValidate.all.invalidInput);
  return errors.length ? validationErrorMessagesList(errors) : undefined;
};

export const validationEmail = (
  value: string | undefined,
  isRequired?: boolean
) => {
  if (isRequired && !value) return exceptions.formValidate.all.requiredField;
  if (!value) return undefined;
  const errors: string[] = [];
  if (!/^\S+@\S{2,}\.\S{2,}$/.test(value))
    errors.push(exceptions.formValidate.all.invalidInput);
  return errors.length ? validationErrorMessagesList(errors) : undefined;
};

export const validationDistricts = (
  value: string[] | undefined,
  isRequired?: boolean
) => {
  if ((isRequired && !value?.length) || (value && value[0] === undefined))
    return exceptions.formValidate.all.requiredField;
  if (!value?.length) return undefined;
};

export const validationDefault = (
  value: string | string[] | undefined,
  isRequired?: boolean
) => {
  const message = exceptions.formValidate.all.requiredField;
  if (Array.isArray(value) && isRequired && !value.length) return message;
  if (isRequired && !value) return message;
  if (!value) return undefined;
};
