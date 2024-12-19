import { Fieldset, TextInput, MultiSelect, InputBase } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { IMaskInput } from "react-imask";
import { FC, useState } from "react";
import { useDispatch, useSelector } from "@/services/store";
import { FormButtons } from "@/components/buttons";
import { getPersonsStatus } from "@/services/person/reducer";
import { createPerson, updatePerson } from "@/services/person/action";
import { personRoles } from "../person-roles";
import { TPersonRoles, TProject, TDistrict, TPerson } from "@/types";
import {
  validationEmail,
  validationName,
  validationPatronymic,
  validationPhone,
  validationSurname,
} from "./validation";
import exceptions from "@/constants/exceptions";
import { formatDateToString } from "@/utils";
import { formatName } from "@/utils/format-name";
import "@mantine/dates/styles.css";
import classes from "./form.module.css";

type TFormSavePerson = {
  dataToUpdate?: TPerson;
  projects: TProject[];
  districts: TDistrict[];
  onClose?: () => void;
};

type TInitialValues = {
  surname: string | undefined;
  name: string;
  patronymic: string | undefined;
  birthday: Date | undefined;
  phone: string;
  email: string | undefined;
  roles: TPersonRoles;
  projects: string[];
  districts: string[];
};

dayjs.extend(customParseFormat); // кастомный формат ввода даты
const correctAge = 18; // допустимый возраст волонтера

export const FormSavePerson: FC<TFormSavePerson> = ({
  dataToUpdate,
  projects,
  districts,
  onClose,
}) => {
  const dispatch = useDispatch();
  const status = useSelector(getPersonsStatus);
  const [phone, setPhone] = useState<string | "">("");

  const initialValues: TInitialValues = {
    surname: dataToUpdate?.surname || "",
    name: dataToUpdate?.name || "",
    patronymic: dataToUpdate?.patronymic || "",
    birthday: dataToUpdate?.birthday
      ? new Date(dataToUpdate?.birthday)
      : undefined,
    phone: dataToUpdate?.phone || "",
    email: dataToUpdate?.email || "",
    roles: dataToUpdate?.roles ?? [],
    projects: dataToUpdate?.projects
      ? dataToUpdate?.projects.map((item) => item.id)
      : [],
    districts: dataToUpdate
      ? dataToUpdate.districts.map((item) => item.id)
      : [],
  };

  const form = useForm({
    mode: "uncontrolled",
    initialValues: initialValues,
    validate: {
      surname: (value) => validationSurname(value),
      name: (value) => validationName(value),
      patronymic: (value) => validationPatronymic(value),
      phone: (value) => validationPhone(value || phone),
      email: (value) => validationEmail(value),
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
    const personData = {
      surname: formatName(form.getValues().surname) || undefined,
      name: formatName(form.getValues().name),
      patronymic: formatName(form.getValues().patronymic) || undefined,
      birthday: form.getValues().birthday
        ? formatDateToString(form.getValues().birthday, "desc")
        : undefined,
      phone: form.getValues().phone || phone,
      email: form.getValues().email || undefined,
      roles: form.getValues().roles,
      districtsIds: form.getValues().districts,
      projectsIds: form.getValues().projects,
    };
    if (dataToUpdate) {
      dispatch(updatePerson({ id: dataToUpdate.id, data: personData }));
    } else {
      dispatch(createPerson(personData));
    }
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
            clearable
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
      <FormButtons
        loading={status.create.loading || status.update.loading}
        onClose={onClose}
      />
    </form>
  );
};
