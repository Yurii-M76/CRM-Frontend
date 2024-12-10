import {
  Fieldset,
  TextInput,
  Select,
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
import { dateFormat } from "@/utils/date-format";
import { TPersonRoles, TProject, TDistrict } from "@/types";
import { useDispatch, useSelector } from "@/services/store";
import { AddFormButtons } from "@/components/buttons";
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
import "@mantine/dates/styles.css";
import classes from "./add-form.module.css";
import exceptions from "@/constants/exceptions";

type TAddForm = {
  projects: TProject[];
  districts: TDistrict[];
  onClose?: () => void;
};

type TInitialValues = {
  surname: string;
  name: string;
  patronymic: string;
  birthday: string;
  phone: string;
  email: string;
  roles: TPersonRoles;
  projects: string[];
  districts: string[];
};

export const AddForm: FC<TAddForm> = ({ projects, districts, onClose }) => {
  const dispatch = useDispatch();
  const status = useSelector(getPersonsStatus);
  const [phone, setPhone] = useState<string | "">("");
  dayjs.extend(customParseFormat); // кастомный формат ввода даты
  const correctAge = 18; // допустимый возраст волонтера

  const initialValues: TInitialValues = {
    surname: "",
    name: "",
    patronymic: "",
    birthday: "",
    phone: "",
    email: "",
    roles: [],
    projects: [],
    districts: [],
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
        !value.length ? exceptions.persons.formValidate.requiredField : null,
      roles: (value) =>
        !value.length ? exceptions.persons.formValidate.requiredField : null,
    },
  });

  const handleSubmit = () => {
    const newPerson = {
      surname: form.getValues().surname || undefined,
      name: form.getValues().name,
      patronymic: form.getValues().patronymic || undefined,
      birthday: dateFormat(form.getValues().birthday) || undefined,
      phone: phone,
      email: form.getValues().email || undefined,
      roles: form.getValues().roles,
      districtsIds: [form.getValues().districts],
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
        <Select
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
      <AddFormButtons loading={status.create.loading} onClose={onClose} />
    </form>
  );
};
