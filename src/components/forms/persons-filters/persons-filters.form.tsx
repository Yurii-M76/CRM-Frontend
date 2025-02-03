import {
  Button,
  Fieldset,
  Group,
  MultiSelect,
  Tabs,
  Textarea,
  TextInput,
  Badge,
  InputBase,
  Chip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { IMaskInput } from "react-imask";
import { FC, useEffect } from "react";
import {
  validationEmail,
  validationName,
  validationPatronymic,
  validationPhone,
  validationSurname,
} from "@forms";
import { Role, TDistrict, TProject } from "@/types";
import classes from "../forms.module.css";

type TPersonsFiltersForm = {
  roles: {
    value: string;
    label: Role;
  }[];
  projects: TProject[];
  districts: TDistrict[];
};

type TInitialValues = {
  surname: string;
  name: string;
  patronymic: string;
  birthday: Date | null;
  phone: string;
  email: string;
  districts: string[];
  roles: string[];
  projects: string[];
  car: string;
  organization: string;
  note: string;
  isNotEmptySurname: boolean;
  isNotEmptyPatronymic: boolean;
  isNotEmptyBirthday: boolean;
  isNotEmptyPhone: boolean;
  isNotEmptyEmail: boolean;
  isNotEmptyRoles: boolean;
  isNotEmptyProjects: boolean;
  isNotEmptyCar: boolean;
  isNotEmptyOrganization: boolean;
  isNotEmptyNote: boolean;
  isEmptySurname: boolean;
  isEmptyPatronymic: boolean;
  isEmptyBirthday: boolean;
  isEmptyPhone: boolean;
  isEmptyEmail: boolean;
  isEmptyRoles: boolean;
  isEmptyProjects: boolean;
  isEmptyCar: boolean;
  isEmptyOrganization: boolean;
  isEmptyNote: boolean;
};

enum fieldNames {
  surname = "Фамилия",
  name = "Имя",
  patronymic = "Отчество",
  birthday = "Дата рождения",
  phone = "Телефон",
  email = "Email",
  districts = "Район",
  roles = "Роль",
  projects = "Проекты",
  car = "Автомобиль",
  organization = "Органиция",
  note = "Примечание",
}

const PersonsFiltersForm: FC<TPersonsFiltersForm> = ({
  roles,
  projects,
  districts,
}) => {
  const initialValues: TInitialValues = {
    surname: "",
    name: "",
    patronymic: "",
    birthday: null,
    phone: "",
    email: "",
    districts: [],
    roles: [],
    projects: [],
    car: "",
    organization: "",
    note: "",
    isNotEmptySurname: false,
    isNotEmptyPatronymic: false,
    isNotEmptyBirthday: false,
    isNotEmptyPhone: false,
    isNotEmptyEmail: false,
    isNotEmptyRoles: false,
    isNotEmptyProjects: false,
    isNotEmptyCar: false,
    isNotEmptyOrganization: false,
    isNotEmptyNote: false,
    isEmptySurname: false,
    isEmptyPatronymic: false,
    isEmptyBirthday: false,
    isEmptyPhone: false,
    isEmptyEmail: false,
    isEmptyRoles: false,
    isEmptyProjects: false,
    isEmptyCar: false,
    isEmptyOrganization: false,
    isEmptyNote: false,
  };

  const form = useForm({
    mode: "controlled",
    initialValues: initialValues,
    validate: {
      surname: (value) => validationSurname(value),
      name: (value) => validationName(value),
      patronymic: (value) => validationPatronymic(value),
      phone: (value) => validationPhone(value, 18),
      email: (value) => validationEmail(value),
    },
  });

  const isExistValues = Object.values(form.getDirty()).some((item) =>
    Array.isArray(item) ? item.length > 0 : item
  );

  const isNotEmptySurname: boolean = form.getValues().isNotEmptySurname;
  const isEmptySurname: boolean = form.getValues().isEmptySurname;
  const isChipsOnSurname: boolean = isNotEmptySurname || isEmptySurname;
  const surnameValue: string = form.getValues().surname;

  const nameValue: string = form.getValues().name;

  const isNotEmptyPatronymic: boolean = form.getValues().isNotEmptyPatronymic;
  const isEmptyPatronymic: boolean = form.getValues().isEmptyPatronymic;
  const isChipsOnPatronymic: boolean =
    isNotEmptyPatronymic || isEmptyPatronymic;
  const patronymicValue: string = form.getValues().patronymic;

  const isNotEmptyBirthday: boolean = form.getValues().isNotEmptyBirthday;
  const isEmptyBirthday: boolean = form.getValues().isEmptyBirthday;
  const isChipsOnBirthday: boolean = isNotEmptyBirthday || isEmptyBirthday;
  const birthdayValue: Date | null = form.getValues().birthday;

  const isNotEmptyPhone: boolean = form.getValues().isNotEmptyPhone;
  const isEmptyPhone: boolean = form.getValues().isEmptyPhone;
  const isChipsOnPhone: boolean = isNotEmptyPhone || isEmptyPhone;
  const phoneValue: string = form.getValues().phone;

  const isNotEmptyEmail: boolean = form.getValues().isNotEmptyEmail;
  const isEmptyEmail: boolean = form.getValues().isEmptyEmail;
  const isChipsOnEmail: boolean = isNotEmptyEmail || isEmptyEmail;
  const emailValue: string = form.getValues().email;

  const districtValue: string[] = form.getValues().districts;

  const isNotEmptyRoles: boolean = form.getValues().isNotEmptyRoles;
  const isEmptyRoles: boolean = form.getValues().isEmptyRoles;
  const isChipsOnRoles: boolean = isNotEmptyRoles || isEmptyRoles;
  const rolesValue: string[] = form.getValues().roles;

  const isNotEmptyProjects: boolean = form.getValues().isNotEmptyProjects;
  const isEmptyProjects: boolean = form.getValues().isEmptyProjects;
  const isChipsOnProjects: boolean = isNotEmptyProjects || isEmptyProjects;
  const projectsValue: string[] = form.getValues().projects;

  const isNotEmptyCar: boolean = form.getValues().isNotEmptyCar;
  const isEmptyCar: boolean = form.getValues().isEmptyCar;
  const isChipsOnCar: boolean = isNotEmptyCar || isEmptyCar;
  const carValue: string = form.getValues().car;

  const isNotEmptyOrganization: boolean =
    form.getValues().isNotEmptyOrganization;
  const isEmptyOrganization: boolean = form.getValues().isEmptyOrganization;
  const isChipsOnOrganization: boolean =
    isNotEmptyOrganization || isEmptyOrganization;
  const organizationValue: string = form.getValues().organization;

  const isNotEmptyNote: boolean = form.getValues().isNotEmptyNote;
  const isEmptyNote: boolean = form.getValues().isEmptyNote;
  const isChipsOnNote: boolean = isNotEmptyNote || isEmptyNote;
  const noteValue: string = form.getValues().note;

  const fieldValues = (
    <Group gap={4}>
      {(surnameValue || isChipsOnSurname) && (
        <Badge variant="light" color="blue">
          {fieldNames.surname}
        </Badge>
      )}
      {nameValue && (
        <Badge variant="light" color="blue">
          {fieldNames.name}
        </Badge>
      )}
      {(patronymicValue || isChipsOnPatronymic) && (
        <Badge variant="light" color="blue">
          {fieldNames.patronymic}
        </Badge>
      )}
      {(birthdayValue || isChipsOnBirthday) && (
        <Badge variant="light" color="blue">
          {fieldNames.birthday}
        </Badge>
      )}
      {(phoneValue || isChipsOnPhone) && (
        <Badge variant="light" color="blue">
          {fieldNames.phone}
        </Badge>
      )}
      {(emailValue || isChipsOnEmail) && (
        <Badge variant="light" color="blue">
          {fieldNames.email}
        </Badge>
      )}
      {districtValue.length && (
        <Badge variant="light" color="blue">
          {fieldNames.districts}
        </Badge>
      )}
      {(rolesValue.length || isChipsOnRoles) && (
        <Badge variant="light" color="blue">
          {fieldNames.roles}
        </Badge>
      )}
      {(projectsValue.length || isChipsOnProjects) && (
        <Badge variant="light" color="blue">
          {fieldNames.projects}
        </Badge>
      )}
      {(carValue || isChipsOnCar) && (
        <Badge variant="light" color="blue">
          {fieldNames.car}
        </Badge>
      )}
      {(organizationValue || isChipsOnOrganization) && (
        <Badge variant="light" color="blue">
          {fieldNames.organization}
        </Badge>
      )}
      {(noteValue || isChipsOnNote) && (
        <Badge variant="light" color="blue">
          {fieldNames.note}
        </Badge>
      )}
    </Group>
  );

  const chipsGroup = (
    keyNotEmpty: keyof TInitialValues,
    keyEmpty: keyof TInitialValues,
    notEmpty: boolean | undefined,
    empty: boolean | undefined
  ) => {
    return (
      <Group gap={4}>
        <Chip
          variant="light"
          color="green"
          size="xs"
          radius="sm"
          disabled={empty}
          checked={notEmpty}
          key={form.key(keyNotEmpty)}
          {...form.getInputProps(keyNotEmpty)}
        >
          Любое значение
        </Chip>
        <Chip
          variant="light"
          color="red"
          size="xs"
          radius="sm"
          disabled={notEmpty}
          checked={empty}
          key={form.key(keyEmpty)}
          {...form.getInputProps(keyEmpty)}
        >
          Не заполнено
        </Chip>
      </Group>
    );
  };

  useEffect(() => {
    if (isChipsOnSurname) form.setFieldValue("surname", "");
    if (isChipsOnPatronymic) form.setFieldValue("patronymic", "");
    if (isChipsOnBirthday) form.setFieldValue("birthday", null);
    if (isChipsOnPhone) form.setFieldValue("phone", "");
    if (isChipsOnEmail) form.setFieldValue("email", "");
    if (isChipsOnRoles) form.setFieldValue("roles", []);
    if (isChipsOnProjects) form.setFieldValue("projects", []);
    if (isChipsOnCar) form.setFieldValue("car", "");
    if (isChipsOnOrganization) form.setFieldValue("organization", "");
    if (isChipsOnNote) form.setFieldValue("note", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getValues()]);

  return (
    <form
      className={classes.form}
      onSubmit={form.onSubmit((values) => console.log(values))}
      onReset={form.reset}
    >
      <Tabs defaultValue="basic">
        <Tabs.List mb={24}>
          <Tabs.Tab value="basic">Основное</Tabs.Tab>
          <Tabs.Tab value="other">Прочее</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="basic">
          <Fieldset legend="Персональная информация">
            <div className={classes.fieldset}>
              <div className={classes.inputsGroupOnRow}>
                <div
                  className={classes.inputsGroupOnColumn}
                  style={{ width: "100%", gap: 4 }}
                >
                  <TextInput
                    label={fieldNames.surname}
                    key={form.key("surname")}
                    {...form.getInputProps("surname")}
                    className={classes.formInput}
                    disabled={isChipsOnSurname}
                  />
                  {chipsGroup(
                    "isNotEmptySurname",
                    "isEmptySurname",
                    isNotEmptySurname,
                    isEmptySurname
                  )}
                </div>
                <div
                  className={classes.inputsGroupOnColumn}
                  style={{ width: "100%" }}
                >
                  <TextInput
                    label={fieldNames.name}
                    key={form.key("name")}
                    {...form.getInputProps("name")}
                    className={classes.formInput}
                  />
                </div>
              </div>

              <div className={classes.inputsGroupOnRow}>
                <div
                  className={classes.inputsGroupOnColumn}
                  style={{ width: "100%", gap: 4 }}
                >
                  <TextInput
                    label={fieldNames.patronymic}
                    key={form.key("patronymic")}
                    {...form.getInputProps("patronymic")}
                    className={classes.formInput}
                    disabled={isChipsOnPatronymic}
                  />
                  {chipsGroup(
                    "isNotEmptyPatronymic",
                    "isEmptyPatronymic",
                    isNotEmptyPatronymic,
                    isEmptyPatronymic
                  )}
                </div>
                <div
                  className={classes.inputsGroupOnColumn}
                  style={{ width: "100%", gap: 4 }}
                >
                  <DateInput
                    locale="ru"
                    label={fieldNames.birthday}
                    valueFormat="DD.MM.YYYY"
                    key={form.key("birthday")}
                    {...form.getInputProps("birthday")}
                    className={classes.formInput}
                    disabled={isChipsOnBirthday}
                    clearable
                  />
                  {chipsGroup(
                    "isNotEmptyBirthday",
                    "isEmptyBirthday",
                    isNotEmptyBirthday,
                    isEmptyBirthday
                  )}
                </div>
              </div>
            </div>
          </Fieldset>

          <Fieldset legend="Контакты">
            <div className={classes.fieldset}>
              <div className={classes.inputsGroupOnRow}>
                <div
                  className={classes.inputsGroupOnColumn}
                  style={{ width: "100%", gap: 4 }}
                >
                  <InputBase
                    type="tel"
                    label={fieldNames.phone}
                    component={IMaskInput}
                    mask="(000) 000-00-00"
                    onAccept={(value) => form.setFieldValue("phone", value)}
                    key={form.key("phone")}
                    {...form.getInputProps("phone")}
                    className={classes.formInput}
                    disabled={isChipsOnPhone}
                  />
                  {chipsGroup(
                    "isNotEmptyPhone",
                    "isEmptyPhone",
                    isNotEmptyPhone,
                    isEmptyPhone
                  )}
                </div>
                <div
                  className={classes.inputsGroupOnColumn}
                  style={{ width: "100%", gap: 4 }}
                >
                  <TextInput
                    label={fieldNames.email}
                    key={form.key("email")}
                    {...form.getInputProps("email")}
                    className={classes.formInput}
                    disabled={isChipsOnEmail}
                  />
                  {chipsGroup(
                    "isNotEmptyEmail",
                    "isEmptyEmail",
                    isNotEmptyEmail,
                    isEmptyEmail
                  )}
                </div>
              </div>
            </div>
          </Fieldset>

          <Fieldset legend="Адрес">
            <div className={classes.fieldset}>
              <MultiSelect
                label={fieldNames.districts}
                key={form.key("districts")}
                data={districts.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                {...form.getInputProps("districts")}
                className={classes.formInput}
                clearable
              />
            </div>
          </Fieldset>
        </Tabs.Panel>

        <Tabs.Panel value="other">
          <Fieldset>
            <div className={classes.fieldset}>
              <div
                className={classes.inputsGroupOnColumn}
                style={{ width: "100%", gap: 4 }}
              >
                <MultiSelect
                  label={fieldNames.roles}
                  key={form.key("roles")}
                  data={roles}
                  {...form.getInputProps("roles")}
                  className={classes.formInput}
                  disabled={isChipsOnRoles}
                  clearable
                ></MultiSelect>
                {chipsGroup(
                  "isNotEmptyRoles",
                  "isEmptyRoles",
                  isNotEmptyRoles,
                  isEmptyRoles
                )}
              </div>
              <div
                className={classes.inputsGroupOnColumn}
                style={{ width: "100%", gap: 4 }}
              >
                <MultiSelect
                  label={fieldNames.projects}
                  key={form.key("projects")}
                  data={projects.map((item) => ({
                    value: item.id,
                    label: item.title,
                  }))}
                  {...form.getInputProps("projects")}
                  className={classes.formInput}
                  disabled={isChipsOnProjects}
                  searchable
                  clearable
                ></MultiSelect>
                {chipsGroup(
                  "isNotEmptyProjects",
                  "isEmptyProjects",
                  isNotEmptyProjects,
                  isEmptyProjects
                )}
              </div>

              <div
                className={classes.inputsGroupOnColumn}
                style={{ width: "100%", gap: 4 }}
              >
                <TextInput
                  label={fieldNames.car}
                  key={form.key("car")}
                  {...form.getInputProps("car")}
                  className={classes.formInput}
                  disabled={isChipsOnCar}
                />
                {chipsGroup(
                  "isNotEmptyCar",
                  "isEmptyCar",
                  isNotEmptyCar,
                  isEmptyCar
                )}
              </div>

              <div
                className={classes.inputsGroupOnColumn}
                style={{ width: "100%", gap: 4 }}
              >
                <TextInput
                  label={fieldNames.organization}
                  key={form.key("organization")}
                  {...form.getInputProps("organization")}
                  className={classes.formInput}
                  disabled={isChipsOnOrganization}
                />
                {chipsGroup(
                  "isNotEmptyOrganization",
                  "isEmptyOrganization",
                  isNotEmptyOrganization,
                  isEmptyOrganization
                )}
              </div>

              <div
                className={classes.inputsGroupOnColumn}
                style={{ width: "100%", gap: 4 }}
              >
                <Textarea
                  label={fieldNames.note}
                  key={form.key("note")}
                  {...form.getInputProps("note")}
                  disabled={isChipsOnNote}
                  autosize
                  minRows={2}
                  maxRows={8}
                />
                {chipsGroup(
                  "isNotEmptyNote",
                  "isEmptyNote",
                  isNotEmptyNote,
                  isEmptyNote
                )}
              </div>
            </div>
          </Fieldset>
        </Tabs.Panel>
      </Tabs>

      {isExistValues && (
        <Fieldset legend="Фильтруемые поля">{fieldValues}</Fieldset>
      )}

      <Group mt="lg" justify="flex-end" gap={8}>
        <Button
          type="reset"
          variant="subtle"
          color="gray"
          disabled={!isExistValues}
        >
          Очистить
        </Button>
        <Button type="submit" disabled={!isExistValues}>
          Фильтровать
        </Button>
      </Group>
    </form>
  );
};

export default PersonsFiltersForm;
