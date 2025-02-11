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
  OptionsFilter,
  ComboboxItem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { IMaskInput } from "react-imask";
import { FC, ReactNode, useEffect } from "react";
import {
  validationEmail,
  validationName,
  validationPatronymic,
  validationPhone,
  validationSurname,
} from "@forms";
import { useDispatch, useSelector } from "@/services/store";
import {
  getFilterValues,
  resetFilters,
  setFilters,
} from "@/services/person/reducer";
import { Role, TDistrict, TPersonsFilters, TProject } from "@/types";
import classes from "../forms.module.css";

type TPersonsFiltersForm = {
  rolesData: {
    value: string;
    label: Role;
  }[];
  projectsData: TProject[];
  districtsData: TDistrict[];
  onClickFiltered: () => void;
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
  rolesData,
  projectsData,
  districtsData,
  onClickFiltered,
}) => {
  const dispatch = useDispatch();
  const filterValues = useSelector(getFilterValues);

  const initialValues: TPersonsFilters = {
    surname: "",
    name: "",
    patronymic: "",
    birthday: "",
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
      phone: (value) => validationPhone(value, 15),
      email: (value) => validationEmail(value),
    },
  });

  const {
    surname,
    name,
    patronymic,
    birthday,
    phone,
    email,
    districts,
    roles,
    projects,
    car,
    organization,
    note,
    isNotEmptySurname,
    isNotEmptyPatronymic,
    isNotEmptyBirthday,
    isNotEmptyPhone,
    isNotEmptyEmail,
    isNotEmptyRoles,
    isNotEmptyProjects,
    isNotEmptyCar,
    isNotEmptyOrganization,
    isNotEmptyNote,
    isEmptySurname,
    isEmptyPatronymic,
    isEmptyBirthday,
    isEmptyPhone,
    isEmptyEmail,
    isEmptyRoles,
    isEmptyProjects,
    isEmptyCar,
    isEmptyOrganization,
    isEmptyNote,
  } = form.getValues();

  const isChipsOnSurname = isNotEmptySurname || isEmptySurname;
  const isChipsOnPatronymic = isNotEmptyPatronymic || isEmptyPatronymic;
  const isChipsOnBirthday = isNotEmptyBirthday || isEmptyBirthday;
  const isChipsOnPhone = isNotEmptyPhone || isEmptyPhone;
  const isChipsOnEmail = isNotEmptyEmail || isEmptyEmail;
  const isChipsOnRoles = isNotEmptyRoles || isEmptyRoles;
  const isChipsOnProjects = isNotEmptyProjects || isEmptyProjects;
  const isChipsOnCar = isNotEmptyCar || isEmptyCar;
  const isChipsOnOrganization = isNotEmptyOrganization || isEmptyOrganization;
  const isChipsOnNote = isNotEmptyNote || isEmptyNote;

  const isFormFiledValues = Object.values(form.getValues()).some((item) => {
    if (!item) return false;
    if (typeof item === "string" && item.trim() !== "") {
      return true;
    }
    if (typeof item === "object" && Object.values(item).length > 0) {
      return true;
    }
    if (typeof item === "boolean" && item === true) {
      return true;
    }
  });

  const setBadgeForFilteredFileld = (
    value: string | number | Date | null,
    label: string,
    isChips?: boolean
  ): ReactNode => {
    return (
      (value || isChips) && (
        <Badge variant="light" color="blue">
          {label}
        </Badge>
      )
    );
  };

  const filteredFilelds = (
    <Group gap={4}>
      {setBadgeForFilteredFileld(surname, fieldNames.surname, isChipsOnSurname)}
      {setBadgeForFilteredFileld(name, fieldNames.name)}
      {setBadgeForFilteredFileld(
        patronymic,
        fieldNames.patronymic,
        isChipsOnPatronymic
      )}
      {setBadgeForFilteredFileld(
        birthday,
        fieldNames.birthday,
        isChipsOnBirthday
      )}
      {setBadgeForFilteredFileld(phone, fieldNames.phone, isChipsOnPhone)}
      {setBadgeForFilteredFileld(email, fieldNames.email, isChipsOnEmail)}
      {setBadgeForFilteredFileld(districts.length, fieldNames.districts)}
      {setBadgeForFilteredFileld(
        roles.length,
        fieldNames.roles,
        isChipsOnRoles
      )}
      {setBadgeForFilteredFileld(
        projects.length,
        fieldNames.projects,
        isChipsOnProjects
      )}
      {setBadgeForFilteredFileld(car, fieldNames.car, isChipsOnCar)}
      {setBadgeForFilteredFileld(
        organization,
        fieldNames.organization,
        isChipsOnOrganization
      )}
      {setBadgeForFilteredFileld(note, fieldNames.note, isChipsOnNote)}
    </Group>
  );

  const chipsGroup = (
    keyNotEmpty: keyof Omit<TPersonsFilters, "id">,
    keyEmpty: keyof Omit<TPersonsFilters, "id">,
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

  const optionsFilter: OptionsFilter = ({ options, search }) => {
    const filtered = (options as ComboboxItem[]).filter((option) =>
      option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
    );

    filtered.sort((a, b) => a.label.localeCompare(b.label));
    return filtered;
  };

  const handleSubmit = () => {
    dispatch(setFilters(form.getValues()));
  };

  const handleReset = () => {
    dispatch(resetFilters());
    form.reset();
  };

  useEffect(() => {
    if (filterValues) {
      // установка значений в поля формы при активном фильтре
      Object.keys(initialValues).forEach((key) => {
        const value = filterValues[key as keyof TPersonsFilters];
        if (value !== undefined) {
          form.setFieldValue(key, value);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValues]);

  return (
    <form
      className={classes.form}
      onSubmit={form.onSubmit(handleSubmit)}
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
                    value={
                      !isFormFiledValues
                        ? null
                        : birthday
                        ? new Date(birthday)
                        : undefined
                    }
                    onChange={(value) => {
                      if (value !== null) {
                        form.setFieldValue("birthday", String(value));
                      } else {
                        form.setFieldValue("birthday", null);
                      }
                    }}
                    className={classes.formInput}
                    disabled={isChipsOnBirthday}
                    clearable={!isChipsOnBirthday}
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
                data={districtsData.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                {...form.getInputProps("districts")}
                className={classes.formInput}
                filter={optionsFilter}
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
                  data={rolesData}
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
                  data={projectsData.map((item) => ({
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

      {isFormFiledValues && (
        <Fieldset legend="Фильтруемые поля">{filteredFilelds}</Fieldset>
      )}

      <Group mt="lg" justify="flex-end" gap={8}>
        <Button
          type="reset"
          variant="subtle"
          color="gray"
          onClick={handleReset}
        >
          Очистить
        </Button>
        <Button
          type="submit"
          disabled={!isFormFiledValues}
          onClick={form.isValid() ? onClickFiltered : undefined}
        >
          Фильтровать
        </Button>
      </Group>
    </form>
  );
};

export default PersonsFiltersForm;
