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
import { FC, useEffect, useState } from "react";
import { useDispatch } from "@/services/store";
import { createProject, updateProject } from "@/services/project/action";
import { ButtonsDefaultFromForm } from "@/components";
import "dayjs/locale/ru";
import { formatDateToString } from "@/utils";
import { TCalendar, TDistrict, TPerson, TProject } from "@/types";
import exceptions from "@/constants/exceptions";
import classes from "../forms.module.css";

type TFormSaveProject = {
  updData?: TProject;
  persons: TPerson[];
  districts: TDistrict[];
  onClose?: () => void;
};

type TInitialValues = {
  title: string;
  calendar: TCalendar;
  dates: Date[];
  description: string;
  districtsIds: string[];
  personsIds: string[];
  note: string;
};

const FormSaveProject: FC<TFormSaveProject> = ({
  updData,
  persons,
  districts,
  onClose,
}) => {
  const dispatch = useDispatch();
  const [oneDate, setOneDate] = useState<Date | null>(null); // дата по умолчанию (один день)
  const [datesRange, setDatesRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]); // диапазон дат
  const [datesMultiple, setDatesMultiple] = useState<Date[]>([]); // несколько дат (не линейно)
  const [variantCalendar, setVariantCalendar] = useState<TCalendar>("default");
  const [selectedDatesForFormField, setSelectedDatesForFormField] = useState<
    string[]
  >([]); // для поля "выбранные даты"
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const initialValues: TInitialValues = {
    title: updData?.title || "",
    calendar: updData?.calendar || "default",
    dates: [],
    description: updData?.description || "",
    districtsIds: updData?.districts
      ? updData?.districts.map((item) => item.id)
      : [],
    personsIds: updData?.persons ? updData?.persons.map((item) => item.id) : [],
    note: updData?.note || "",
  };

  const sortDates = (dates: Date[]) =>
    dates.sort((a, b) => a.getTime() - b.getTime());

  const form = useForm({
    mode: "controlled",
    initialValues: initialValues,
    validate: {
      title: (value) =>
        !value.length ? exceptions.formValidate.all.requiredField : undefined,
      districtsIds: (value) =>
        !value.length ? exceptions.formValidate.all.requiredField : undefined,
    },
  });

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

  const handleUpdDate = () => {
    const updCalendar = updData?.calendar;

    if (updData && updCalendar === variantCalendar) {
      switch (updCalendar) {
        case "default":
          setOneDate(new Date(updData.dates[0]));
          break;
        case "range":
          if (updData.dates.length === 2) {
            setDatesRange([
              new Date(updData.dates[0]),
              new Date(updData.dates[1]),
            ]);
          } else {
            setDatesRange([null, null]);
          }
          break;
        case "multiple":
          setDatesMultiple(updData.dates.map((date) => new Date(date)));
          break;
        default:
          break;
      }
    }
  };

  const handleSelectedDatesForFormField = () => {
    if (oneDate && variantCalendar === "default") {
      setSelectedDatesForFormField([formatDateToString(oneDate, "day_month")]);
      form.setFieldValue("dates", [oneDate]);
    }

    if (datesRange && variantCalendar === "range") {
      const dates: string[] = [];
      datesRange.forEach((date) => {
        if (date) {
          dates.push(formatDateToString(date, "day_month"));
        }
      });
      setSelectedDatesForFormField([dates.join(" - ")]);

      if (datesRange && datesRange[0] && datesRange[1]) {
        const [startDate, endDate] = datesRange;
        form.setFieldValue("dates", [startDate, endDate]);
      }
    }

    if (datesMultiple && variantCalendar === "multiple") {
      const dates: string[] = [];
      datesMultiple.forEach((date) => {
        if (date) {
          dates.push(formatDateToString(date, "day_month"));
        }
      });
      setSelectedDatesForFormField([dates.join(", ")]);

      if (datesMultiple) {
        form.setFieldValue(
          "dates",
          datesMultiple.map((date) => date)
        );
      }
    }
  };

  const isEmptyDateValue = !selectedDatesForFormField.length && isSubmit;

  const handleSubmit = () => {
    if (!isEmptyDateValue) {
      if (updData) {
        dispatch(updateProject({ id: updData.id, data: form.getValues() }));
      } else {
        dispatch(createProject(form.getValues()));
      }
    }
  };

  const calendar =
    variantCalendar === "default" ? (
      <DatePicker
        type="default"
        value={oneDate}
        onChange={setOneDate}
        locale="ru"
        allowDeselect
        renderDay={dayRenderer}
      />
    ) : variantCalendar === "range" ? (
      <DatePicker
        type="range"
        value={datesRange}
        onChange={setDatesRange}
        locale="ru"
        allowDeselect={undefined}
        renderDay={dayRenderer}
      />
    ) : variantCalendar === "multiple" ? (
      <DatePicker
        type="multiple"
        value={sortDates(datesMultiple)}
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

  useEffect(() => {
    setVariantCalendar(form.getValues().calendar);
  }, [form]);

  useEffect(() => {
    setOneDate(null);
    setDatesRange([null, null]);
    setDatesMultiple([]);
    setIsSubmit(false);
    setSelectedDatesForFormField([]);
    form.setFieldValue("dates", []);
    handleUpdDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantCalendar, updData]);

  useEffect(() => {
    handleSelectedDatesForFormField();
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
            className={`${classes.fieldsetForDatePickerGroup} ${
              isEmptyDateValue ? classes.fieldsetError : ""
            } `}
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
              value={selectedDatesForFormField}
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
          id="districtsIds"
          label="Район"
          data={districts.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          key={form.key("districtsIds")}
          {...form.getInputProps("districtsIds")}
          filter={optionsFilter}
          required
        />
        <MultiSelect
          id="personsIds"
          label="Участники"
          data={persons.map((item) => ({
            value: item.id,
            label: item.fullName,
          }))}
          key={form.key("personsIds")}
          clearable
          searchable
          nothingFoundMessage="нет данных"
          {...form.getInputProps("personsIds")}
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
