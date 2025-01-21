import {
  ComboboxItem,
  Fieldset,
  Indicator,
  MultiSelect,
  OptionsFilter,
  Radio,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker, DatePickerProps } from "@mantine/dates";
import { ButtonsDefaultFromForm } from "@/components";
import { FC, useEffect, useState } from "react";
import "dayjs/locale/ru";
import { formatDateToString } from "@/utils";
import { TCalendar, TDistrict, TPerson, TProject } from "@/types";
import exceptions from "@/constants/exceptions";
import classes from "../forms.module.css";

type TFormSaveProject = {
  dataToUpdate?: TProject;
  persons: TPerson[];
  districts: TDistrict[];
  onClose?: () => void;
};

type TInitialValues = {
  title: string;
  calendar: TCalendar;
  dates: string[];
  description: string;
  districts: TDistrict[];
  persons: TPerson[];
  note: string;
};

const initialValues: TInitialValues = {
  title: "",
  calendar: "default",
  dates: [],
  description: "",
  districts: [],
  persons: [],
  note: "",
};

const FormSaveProject: FC<TFormSaveProject> = ({
  // dataToUpdate,
  persons,
  districts,
  onClose,
}) => {
  const [oneDate, setOneDate] = useState<Date | null>(null); // дата по умолчанию (один день)
  const [datesRange, setDatesRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]); // диапазон дат
  const [datesMultiple, setDatesMultiple] = useState<Date[]>([]); // несколько дат (не линейно)
  const [variantDate, setVariantDate] = useState<TCalendar>("default");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const form = useForm({
    mode: "controlled",
    initialValues: initialValues,
    validate: {
      title: (value) =>
        !value.length ? exceptions.formValidate.all.requiredField : undefined,
      districts: (value) =>
        !value.length ? exceptions.formValidate.all.requiredField : undefined,
    },
  });

  const cadendarVariant = form.getValues().calendar;
  const dateValues = form.getValues().dates;
  const dateValuesForInput =
    cadendarVariant === "range"
      ? dateValues.join(" - ")
      : dateValues.join(", ");

  const optionsFilter: OptionsFilter = ({ options, search }) => {
    const filtered = (options as ComboboxItem[]).filter((option) =>
      option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
    );

    filtered.sort((a, b) => a.label.localeCompare(b.label));
    return filtered;
  };

  const dayRenderer: DatePickerProps["renderDay"] = (date) => {
    const day = date.getDate();
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() && (
        <Indicator
          size={6}
          color="green"
          offset={-5}
          disabled={day !== now.getDate()}
        >
          <div>{day}</div>
        </Indicator>
      )
    );
  };

  const calendar =
    variantDate === "default" ? (
      <DatePicker
        type="default"
        value={oneDate}
        onChange={setOneDate}
        locale="ru"
        allowDeselect
        renderDay={dayRenderer}
      />
    ) : variantDate === "range" ? (
      <DatePicker
        type="range"
        value={datesRange}
        onChange={setDatesRange}
        locale="ru"
        allowDeselect={undefined}
        renderDay={dayRenderer}
      />
    ) : variantDate === "multiple" ? (
      <DatePicker
        type="multiple"
        value={datesMultiple}
        onChange={setDatesMultiple}
        locale="ru"
        allowDeselect={undefined}
        renderDay={dayRenderer}
      />
    ) : (
      <DatePicker
        type="default"
        locale="ru"
        excludeDate={(date) => date.getDay() !== -1}
      />
    );

  const isEmptyDateValue = form.getValues().dates[0] === "" && isSubmit;

  const handleSubmit = () => {
    if (!isEmptyDateValue) {
      console.log(form.getValues());
    }
  };

  useEffect(() => {
    setVariantDate(cadendarVariant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  useEffect(() => {
    setOneDate(null);
    setDatesRange([null, null]);
    setDatesMultiple([]);
    setIsSubmit(false);
  }, [variantDate]);

  useEffect(() => {
    const dates: string[] = [];
    if (cadendarVariant === "default") {
      const dateFormat = formatDateToString(oneDate, "asc");
      dates.push(dateFormat ?? "");
      setIsSubmit(false);
    }
    if (cadendarVariant === "range") {
      if (!datesRange[1]) {
        dates.push("");
      } else {
        datesRange.map((day) =>
          dates.push(formatDateToString(day, "asc") ?? "")
        );
        setIsSubmit(false);
      }
    }
    if (cadendarVariant === "multiple") {
      if (!datesMultiple[1]) {
        dates.push("");
      } else {
        datesMultiple.map((day) =>
          dates.push(formatDateToString(day, "asc") ?? "")
        );
        setIsSubmit(false);
      }
    }

    if (cadendarVariant === "undefined") {
      dates.push("-");
      setIsSubmit(false);
    }

    form.setFieldValue("dates", dates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oneDate, datesRange, datesMultiple]);

  return (
    <form
      onSubmit={form.onSubmit(handleSubmit)}
      noValidate
      className={classes.form}
    >
      <div className={classes.inputsGroupOnColumn}>
        <TextInput
          id="title"
          label="Название"
          key={form.key("title")}
          {...form.getInputProps("title")}
          className={classes.formInput}
          required
        />
        <div className={classes.datePickerGroup}>
          <Fieldset
            className={`${
              isEmptyDateValue ? classes.fieldsetErrorForDatePickerGroup : ""
            } ${classes.fieldsetForDatePickerGroup}`}
          >
            <div className={classes.datePickerSettingsAndCalendar}>
              <Radio.Group
                id="calendar"
                name="calendar"
                label="Дата"
                description="Выберите подходящий вариант"
                key={form.key("calendar")}
                {...form.getInputProps("calendar")}
                withAsterisk
              >
                <div className={classes.datePickerSettings}>
                  <Radio id="default" value="default" label="Один день" />
                  <Radio
                    id="range"
                    value="range"
                    label="Диапазон"
                    description="Дни идущие подряд"
                  />
                  <Radio
                    id="multiple"
                    value="multiple"
                    label="Несколько"
                    description="Дни в случайном порядке"
                  />
                  <Radio
                    id="undefined"
                    value="undefined"
                    label="Не определена"
                    color="yellow"
                  />
                </div>
              </Radio.Group>
              <div className={classes.datePicker}>{calendar}</div>
            </div>
            <Textarea
              description="Выбранные даты"
              value={dateValuesForInput}
              className={classes.formInput}
              autosize
              minRows={1}
              maxRows={10}
            />
          </Fieldset>
          {isEmptyDateValue && (
            <p className={classes.datePickerGroupError}>
              {exceptions.formValidate.all.requiredField}
            </p>
          )}
        </div>
        <Textarea
          id="description"
          label="Описание"
          key={form.key("description")}
          {...form.getInputProps("description")}
          autosize
          minRows={8}
          maxRows={20}
          className={classes.formInput}
        />
        <MultiSelect
          id="districts"
          label="Район"
          data={districts.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          key={form.key("districts")}
          {...form.getInputProps("districts")}
          filter={optionsFilter}
          required
        />
        <MultiSelect
          id="persons"
          label="Участники"
          data={persons.map((item) => ({
            value: item.id,
            label: item.fullName,
          }))}
          key={form.key("persons")}
          clearable
          searchable
          nothingFoundMessage="нет данных"
          {...form.getInputProps("persons")}
          filter={optionsFilter}
          className={classes.formInput}
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
      <ButtonsDefaultFromForm
        loading={false}
        onClose={onClose}
        onClick={() => setIsSubmit(true)}
      />
    </form>
  );
};

export default FormSaveProject;
