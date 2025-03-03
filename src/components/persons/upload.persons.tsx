import { FC, useEffect, useState } from "react";
import { Anchor } from "@mantine/core";
import {
  UploadFilesForm,
  validationDistricts,
  validationEmail,
  validationName,
  validationPatronymic,
  validationPhone,
  validationSurname,
} from "@forms";
import { Alert } from "@components";
import { exportToExcel } from "@/utils";
import { TPerson, TUploadErrorsLog } from "@types";

type TUploadPersons = {
  headers: { header: string; key: string; width: number }[];
  setIsOpenUpload: () => void;
  isOpenUpload: boolean;
};

export const UploadPersons: FC<TUploadPersons> = ({
  headers,
  setIsOpenUpload,
}) => {
  const [json, setJson] = useState<unknown[] | undefined>(undefined);
  const [validData, setValidData] = useState<TPerson[] | undefined>(undefined);
  const errorsLog: TUploadErrorsLog[] = [];

  const data = json as TPerson[];
  data?.forEach((item, _index) => {
    const errors: string[] = [];

    const surnameError = validationSurname(item.surname);
    const nameError = validationName(item.name, true);
    const patronymicError = validationPatronymic(item.patronymic);
    const phoneError = validationPhone(item.phone, 10);
    const emailError = validationEmail(item.email);
    const districtError = validationDistricts(
      Array.isArray(item.districts)
        ? [item.districts.join()]
        : [item.districts],
      true
    );

    const fields = [
      { label: "Фамилия", error: surnameError },
      { label: "Имя", error: nameError },
      { label: "Отчество", error: patronymicError },
      { label: "Район", error: districtError },
      { label: "Телефон", error: phoneError },
      { label: "Email", error: emailError },
    ];

    fields.forEach((field) => {
      if (field.error) {
        errors.push(`[${field.label}] ${field.error}`);
      }
    });

    errors.forEach((error) => {
      const index = _index + 2;
      errorsLog.push({
        row: index,
        error: `Строка ${index}: ${error}`,
      });
    });
  });

  useEffect(() => {
    const _validData: TPerson[] = json?.filter((_, index) => {
      return !errorsLog.some((error) => error.row - 2 === index);
    }) as TPerson[];
    setValidData(_validData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [json]);

  return (
    <UploadFilesForm
      data={setJson}
      errorsLog={errorsLog}
      validData={validData}
      onClose={setIsOpenUpload}
    >
      <Alert
        message="Прикрепите файл Excel с расширением .xls или .xlsx, размером не более 5 мегабайт, по форме, предложенной ниже."
        type="info"
        variant="light"
        disabledTitle={true}
      >
        <Anchor
          size="sm"
          onClick={() =>
            exportToExcel([], headers, [], true, "import_persons_form")
          }
        >
          Форма для загрузки персоналий
        </Anchor>
      </Alert>
    </UploadFilesForm>
  );
};

export default UploadPersons;
