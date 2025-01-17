import {
  Fieldset,
  TextInput,
  MultiSelect,
  InputBase,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { IMaskInput } from "react-imask";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "@/services/store";
import {
  getCheckEmail,
  getCheckPhone,
  getPersonsStatus,
} from "@/services/person/reducer";
import {
  checkEmail,
  checkPhone,
  createPerson,
  updatePerson,
} from "@/services/person/action";
import { personRoles } from "../../persons/person-roles";
import { TProject, TDistrict, TPerson } from "@/types";
import {
  validationEmail,
  validationName,
  validationPatronymic,
  validationPhone,
  validationSurname,
} from "./validation";
import { formatDateToString } from "@/utils";
import { formatName } from "@/utils/format-name";
import { ButtonsDefaultFromForm } from "@/components/forms/elements/buttons";
import exceptions from "@/constants/exceptions";
import classes from "../forms.module.css";

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
  phone: string | undefined;
  email: string | undefined;
  roles: string[];
  projects: string[];
  districts: string[];
  car: string;
  organization: string;
  note: string | undefined;
};

dayjs.extend(customParseFormat); // кастомный формат ввода даты
const correctAge = 18; // допустимый возраст волонтера
const correctPhoneLength = 18; // допустимая длина номера телефона

const FormSavePerson: FC<TFormSavePerson> = ({
  dataToUpdate,
  projects,
  districts,
  onClose,
}) => {
  const dispatch = useDispatch();
  const status = useSelector(getPersonsStatus);
  const personIdOnPhoneChecking = useSelector(getCheckPhone);
  const personIdOnEmailChecking = useSelector(getCheckEmail);
  const [phone, setPhone] = useState<string | undefined>("");
  const [email, setEmail] = useState<string | undefined>("");
  const [conflictPhone, setConflictPhone] = useState<boolean>(false);
  const [conflictEmail, setConflictEmail] = useState<boolean>(false);
  const [isDriver, setIsDriver] = useState<boolean>(false);
  const [isDelegate, setIsDelegate] = useState<boolean>(false);

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
    car: dataToUpdate?.car || "",
    organization: dataToUpdate?.organization || "",
    note: dataToUpdate?.note || "",
  };

  const form = useForm({
    mode: "controlled",
    initialValues: initialValues,
    validate: {
      surname: (value) => validationSurname(value),
      name: (value) => validationName(value),
      patronymic: (value) => validationPatronymic(value),
      phone: (value) =>
        validationPhone(value, email === "") ||
        (phone?.length === correctPhoneLength &&
          conflictPhone &&
          exceptions.persons.forms.save.conflictPhone),
      email: (value) =>
        // validationEmail(value, phone?.length !== correctPhoneLength),
        validationEmail(value, phone?.length !== correctPhoneLength) ||
        (email !== "" &&
          conflictEmail &&
          exceptions.persons.forms.save.conflictEmail),
      districts: (value) =>
        !value.length ? exceptions.formValidate.all.requiredField : undefined,
      roles: (value) => {
        return !value.length
          ? exceptions.formValidate.all.requiredField
          : undefined;
      },
      car: (value) =>
        isDriver && !value.length
          ? exceptions.formValidate.all.requiredField
          : undefined,
      organization: (value) =>
        isDelegate && !value.length
          ? exceptions.formValidate.all.requiredField
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
      phone: form.getValues().phone || undefined,
      email: form.getValues().email || undefined,
      roles: form.getValues().roles,
      districtsIds: form.getValues().districts,
      projectsIds: form.getValues().projects,
      car: (isDriver && form.getValues().car) || undefined,
      organization: (isDelegate && form.getValues().organization) || undefined,
      note: form.getValues().note || undefined,
    };
    if (dataToUpdate) {
      dispatch(updatePerson({ id: dataToUpdate.id, data: personData }));
    } else {
      dispatch(createPerson(personData));
    }
  };

  useEffect(() => {
    const _phone = form.getValues().phone
    if (_phone && /^.{18}$/.test(_phone)) {
      setPhone(_phone); 
      console.log(_phone)   
    }

    const _email = form.getValues().email
    if (_email && /^\S+@\S{2,}\.\S{2,}$/.test(_email)) {
      setEmail(form.getValues().email);
      
    }

  }, [form]);

  useEffect(() => {
    if (phone?.length === correctPhoneLength) {
      dispatch(checkPhone(phone));
    }
  }, [dispatch, phone]);

  useEffect(() => {
    const id = personIdOnPhoneChecking?.id;
    if (id && id !== dataToUpdate?.id) {
      setConflictPhone(true);
    } else {
      setConflictPhone(false);
    }
  }, [conflictPhone, personIdOnPhoneChecking]);

  useEffect(() => {
    if (email) {
      dispatch(checkEmail(email));
    }
  }, [dispatch, email]);

  useEffect(() => {
    const id = personIdOnEmailChecking?.id;
    if (id && id !== dataToUpdate?.id) {
      setConflictEmail(true);
    } else {
      setConflictEmail(false);
    }
  }, [conflictEmail, personIdOnEmailChecking]);

  useEffect(() => {
    setIsDriver(
      form.getInputProps("roles").value.includes("DRIVER") ? true : false
    );
    setIsDelegate(
      form.getInputProps("roles").value.includes("DELEGATE") ? true : false
    );
  }, [form]);

  return (
    <form
      className={classes.form}
      onSubmit={form.onSubmit(handleSubmit)}
      noValidate
    >
      <Fieldset legend="Персональная информация">
        <div className={classes.fieldset}>
          <div className={classes.inputsGroupOnRow}>
            <TextInput
              id="surname"
              label="Фамилия"
              key={form.key("surname")}
              {...form.getInputProps("surname")}
              className={classes.formInput}
            />
            <TextInput
              id="name"
              label="Имя"
              key={form.key("name")}
              {...form.getInputProps("name")}
              className={classes.formInput}
              required
            />
          </div>
          <div className={classes.inputsGroupOnRow}>
            <TextInput
              id="patronymic"
              label="Отчество"
              key={form.key("patronymic")}
              {...form.getInputProps("patronymic")}
              className={classes.formInput}
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
              className={classes.formInput}
              clearable
            />
          </div>
        </div>
      </Fieldset>
      <Fieldset legend="Контакты">
        <div className={classes.fieldset}>
          <div className={classes.inputsGroupOnRow}>
            <InputBase
              id="phone"
              label="Телефон"
              description="Обязательно, при отсутствии email"
              type="tel"
              component={IMaskInput}
              mask="+7 (000) 000-00-00"
              key={form.key("phone")}
              {...form.getInputProps("phone")}
              className={classes.formInput}
              required={email === ""}
            />
            <TextInput
              id="email"
              label="Email"
              type="email"
              description="Обязательно, при отсутствии телефона"
              key={form.key("email")}
              {...form.getInputProps("email")}
              className={classes.formInput}
              required={phone?.length !== correctPhoneLength}
            />
          </div>
        </div>
      </Fieldset>
      <Fieldset legend="Адрес">
        <div className={classes.fieldset}>
          <MultiSelect
            id="districts"
            label="Район"
            data={districts.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            key={form.key("districts")}
            {...form.getInputProps("districts")}
            required
          />
        </div>
      </Fieldset>
      <Fieldset legend="Прочее">
        <div className={classes.fieldset}>
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
          {isDriver && (
            <TextInput
              id="car"
              label="Данные по автомобилю"
              key={form.key("car")}
              {...form.getInputProps("car")}
              required={isDriver}
            />
          )}
          {isDelegate && (
            <TextInput
              id="organization"
              label="Организация"
              key={form.key("organization")}
              {...form.getInputProps("organization")}
              required={isDelegate}
            />
          )}
          <MultiSelect
            id="projects"
            label="Проекты"
            data={projects.map((item) => ({
              value: item.id,
              label: item.title,
            }))}
            key={form.key("projects")}
            clearable
            searchable
            nothingFoundMessage="нет данных"
            {...form.getInputProps("projects")}
          />
          <Textarea
            id="note"
            label="Примечание"
            key={form.key("note")}
            {...form.getInputProps("note")}
            autosize
            minRows={2}
            maxRows={8}
          />
        </div>
      </Fieldset>
      <ButtonsDefaultFromForm
        loading={status.create.loading || status.update.loading}
        onClose={onClose}
      />
    </form>
  );
};

export default FormSavePerson;
