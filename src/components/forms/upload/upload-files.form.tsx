import { Button, FileInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FC, ReactNode, useEffect } from "react";
import { Alert, ButtonsDefaultFromForm } from "@/components";
import { excelToJson } from "@/utils/excel-to-json";
import { fieldNames, TUploadErrorsLog } from "@/types";
import { IconFileExcel } from "@assets/icons";
import classes from "../forms.module.css";

type TUploadFilesForm = {
  data: (json: unknown[] | undefined) => void;
  validData?: unknown[];
  errorsLog?: TUploadErrorsLog[];
  onClose?: () => void;
  children?: ReactNode;
};

type TInitialValues = {
  file: File | null;
};

const type =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const UploadFilesForm: FC<TUploadFilesForm> = ({
  onClose,
  data,
  validData,
  errorsLog,
  children,
}) => {
  // TODO: доработать механизм импорта валидных данных
  // TODO: доработать экспорт лога ошибок импорта

  console.log(errorsLog);
  console.log(validData);
  
  const initialValues: TInitialValues = {
    file: null,
  };

  const form = useForm({
    mode: "uncontrolled",
    initialValues: initialValues,
  });

  const handleSubmit = () => {
    const { file } = form.getValues();
    excelToJson(file, fieldNames)
      .then((json) => {
        data(json);
      })
      .catch((error) => {
        console.error(`Upload file error: ${error}`);
        form.reset();
      });
  };

  const errors = errorsLog?.length ? (
    <Alert
      type="warning"
      variant="outline"
      disabledTitle
      message={`Найдены не валидные данные (количество строк: ${errorsLog?.length})`}
    >
      <Button variant="light" color="red" w="100%">
        Скачать лог ошибок
      </Button>
    </Alert>
  ) : null;

  useEffect(() => {
    form.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorsLog?.length]);

  return (
    <form className={classes.form} onSubmit={form.onSubmit(handleSubmit)}>
      <div className={classes.fieldset}>
        {children}
        <FileInput
          placeholder="Выбрать файл"
          leftSection={<IconFileExcel strokeWidth={1.2} />}
          accept={type}
          key={form.key("file")}
          {...form.getInputProps("file")}
          clearable
        />
        {errors}
        {!validData ? (
          <ButtonsDefaultFromForm
            // loading={upload.loading}
            onClose={onClose}
            saveButtonLabel="Загрузить"
          />
        ) : (
          ""
        )}
      </div>
    </form>
  );
};

export default UploadFilesForm;
