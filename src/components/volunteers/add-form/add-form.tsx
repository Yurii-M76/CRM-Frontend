// TODO: добавить закрытие модалки при клике по кнопке "отменить"
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
import { TProject } from "@/types";
import { createVolunteer } from "@/services/volunteer/action";
import { useDispatch, useSelector } from "@/services/store";
import { getVolunteersStatus } from "@/services/volunteer/reducer";
import { AddFormButtons } from "@/components/buttons";
import "@mantine/dates/styles.css";
import classes from "./add-form.module.css";

type TAddForm = {
  projects: TProject[];
  onClose?: () => void;
};

type TInitialValues = {
  surname: string;
  name: string;
  patronymic: string;
  birthday: string;
  phone: string;
  email: string;
  district: string;
  projects: string[];
};

export const AddForm: FC<TAddForm> = ({ projects, onClose }) => {
  const dispatch = useDispatch();
  const status = useSelector(getVolunteersStatus);
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
    district: "",
    projects: [],
  };

  const form = useForm({
    mode: "uncontrolled",
    initialValues: initialValues,
    validate: {
      surname: (value) =>
        !value.length
          ? null
          : /^[А-яЁё-]{2,}$/.test(value)
          ? null
          : "Фамилия должна быть не короче двух букв",
      name: (value) =>
        !value.length
          ? "Имя не должно быть пустым"
          : /^[А-яЁё]{2,}$/.test(value)
          ? null
          : "Имя должно быть не короче двух букв",
      patronymic: (value) =>
        !value.length
          ? null
          : /^[А-яЁё]{2,}$/.test(value)
          ? null
          : "Отчество должно быть не короче двух букв",
      phone: () =>
        !phone.length
          ? "Телефон не должен быть пустым"
          : /^.{18}$/.test(phone)
          ? null
          : "Не корректный номер телефона",
      email: (value) =>
        !value.length
          ? null
          : /^\S+@\S{2,}\.\S{2,}$/.test(value)
          ? null
          : "Не корректный email",
      district: (value) =>
        !value.length ? "Район не должен быть пустым" : null,
    },
  });

  const handleSubmit = () => {
    const newVolunteer = {
      surname: form.getValues().surname || undefined,
      name: form.getValues().name,
      patronymic: form.getValues().patronymic || undefined,
      birthday: dateFormat(form.getValues().birthday) || undefined,
      phone: phone,
      email: form.getValues().email || undefined,
    };
    dispatch(createVolunteer(newVolunteer));
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
          id="district"
          label="Район"
          data={[
            "Большесельский район",
            "Борисоглебский район",
            "город Ярославль",
            "город Рыбинск",
          ]}
          key={form.key("district")}
          {...form.getInputProps("district")}
          required
        ></Select>
      </Fieldset>
      <Fieldset legend="Прочее" className={classes.fieldset}>
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
