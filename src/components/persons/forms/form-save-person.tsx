import {
  Fieldset,
  TextInput,
  MultiSelect,
  InputBase,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { IMaskInput } from "react-imask";
import { FC, useState } from "react";
import { TPersonRoles, TProject, TDistrict, TPerson } from "@/types";
import { useDispatch, useSelector } from "@/services/store";
import { FormButtons } from "@/components/buttons";
import { getPersonsStatus } from "@/services/person/reducer";
import { createPerson } from "@/services/person/action";
import { personRoles } from "../person-roles";
import {
  validationEmail,
  validationName,
  validationPatronymic,
  validationPhone,
  validationSurname,
} from "./validation";
import exceptions from "@/constants/exceptions";
import "@mantine/dates/styles.css";
import classes from "./form.module.css";

type TFormSavePerson = {
  data?: TPerson;
  projects: TProject[];
  districts: TDistrict[];
  onClose?: () => void;
};

type TInitialValues = {
  surname: string | undefined;
  name: string | undefined;
  patronymic: string | undefined;
  birthday: Date | undefined;
  phone: string | undefined;
  email: string | undefined;
  roles: TPersonRoles;
  projects: string[] | undefined;
  districts: string[];
};

export const FormSavePerson: FC<TFormSavePerson> = ({
  data,
  projects,
  districts,
  onClose,
}) => {
  const dispatch = useDispatch();
  const status = useSelector(getPersonsStatus);
  const [phone, setPhone] = useState<string | "">("");
  dayjs.extend(customParseFormat); // кастомный формат ввода даты
  const correctAge = 18; // допустимый возраст волонтера

  const initialValues: TInitialValues = {
    surname: data?.surname ?? undefined,
    name: data?.name ?? undefined,
    patronymic: data?.patronymic ?? undefined,
    birthday: data?.birthday ? new Date(data?.birthday) : undefined,
    phone: data?.phone ?? undefined,
    email: data?.email ?? undefined,
    roles: data?.roles ?? [],
    projects: data?.projects
      ? data?.projects.map((item) => item.id)
      : undefined,
    districts: data ? data.districts.map((item) => item.id) : [],
  };

  const form = useForm({
    mode: "uncontrolled",
    initialValues: initialValues,
    validate: {
      surname: validationSurname,
      name: validationName,
      patronymic: validationPatronymic,
      phone: validationPhone,
      email: validationEmail,
      districts: (value) =>
        !value.length
          ? exceptions.persons.formValidate.requiredField
          : undefined,
      roles: (value) =>
        !value.length
          ? exceptions.persons.formValidate.requiredField
          : undefined,
    },
  });

  const handleSubmit = () => {
    const newPerson = {
      surname: form.getValues().surname || undefined,
      name: form.getValues().name,
      patronymic: form.getValues().patronymic || undefined,
      birthday: form.getValues().birthday || undefined,
      phone: phone,
      email: form.getValues().email || undefined,
      roles: form.getValues().roles,
      // districtsIds: [form.getValues().districts],
      districtsIds: Array.isArray(form.getValues().districts)
        ? form.getValues().districts
        : [form.getValues().districts],
      projectsIds: form.getValues().projects || undefined,
    };
    dispatch(createPerson(newPerson));
  };

  return (
    <form
      className={classes.form}
      onSubmit={form.onSubmit(handleSubmit)}
      noValidate
    >
      <Fieldset legend="Персональная информация" className={classes.fieldset}>
        <div className={classes.input_group}>
          <TextInput
            id="surname"
            label="Фамилия"
            key={form.key("surname")}
            {...form.getInputProps("surname")}
            className={classes.input}
          />
          <TextInput
            id="name"
            label="Имя"
            key={form.key("name")}
            {...form.getInputProps("name")}
            className={classes.input}
            required
          />
        </div>
        <div className={classes.input_group}>
          <TextInput
            id="patronymic"
            label="Отчество"
            key={form.key("patronymic")}
            {...form.getInputProps("patronymic")}
            className={classes.input}
          />
          <DateInput
            id="birthday"
            label="Дата рождения"
            maxDate={dayjs(new Date()).add(-correctAge, "year").toDate()}
            minDate={dayjs(new Date()).add(-100, "year").toDate()}
            defaultDate={dayjs(new Date()).add(-correctAge, "year").toDate()}
            locale="ru"
            valueFormat="DD.MM.YYYY"
            key={form.key("birthday")}
            {...form.getInputProps("birthday")}
            className={classes.input}
          />
        </div>
      </Fieldset>
      <Fieldset legend="Контакты" className={classes.fieldset}>
        <div className={classes.input_group}>
          <InputBase
            id="phone"
            label="Телефон"
            component={IMaskInput}
            mask="+7 (000) 000-00-00"
            onAccept={(value) => setPhone(value)}
            key={form.key("phone")}
            {...form.getInputProps("phone")}
            className={classes.input}
            required
          />
          <TextInput
            id="email"
            label="Email"
            key={form.key("email")}
            {...form.getInputProps("email")}
            className={classes.input}
          />
        </div>
      </Fieldset>
      <Fieldset legend="Адрес" className={classes.fieldset}>
        <MultiSelect
          id="districts"
          label="Район"
          data={districts.map((item) => ({ value: item.id, label: item.name }))}
          key={form.key("districts")}
          {...form.getInputProps("districts")}
          required
        />
      </Fieldset>
      <Fieldset legend="" className={classes.fieldset}>
        <MultiSelect
          id="roles"
          label="Роль"
          data={personRoles.map((role) => ({
            value: role.value,
            label: role.label,
          }))}
          key={form.key("roles")}
          {...form.getInputProps("roles")}
          required
        />
        <MultiSelect
          id="projects"
          label="Проекты"
          data={projects.map((item) => ({ value: item.id, label: item.title }))}
          key={form.key("projects")}
          clearable
          searchable
          nothingFoundMessage="нет данных"
          {...form.getInputProps("projects")}
        />
      </Fieldset>
      <FormButtons loading={status.create.loading} onClose={onClose} />
    </form>
  );
};
