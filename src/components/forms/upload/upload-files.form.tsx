import { FileInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FC, ReactNode, useEffect } from "react";
import { Alert, ButtonsDefaultFromForm } from "@/components";
import { useDispatch, useSelector } from "@/services/store";
import { uploadFile } from "@/services/files/actions";
import { getStatusFile, resetFilesErrors } from "@/services/files/reducer";
import { IconFileExcel } from "@assets/icons";
import classes from "../forms.module.css";

type TUploadFilesForm = {
  fileType: "excel" | "image";
  onClose?: () => void;
  children?: ReactNode;
};

type TInitialValues = {
  file: File | null;
};

const fileTypes = {
  excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  image: "image/png,image/jpeg",
};

const UploadFilesForm: FC<TUploadFilesForm> = ({
  onClose,
  fileType,
  children,
}) => {
  const dispatch = useDispatch();
  const { upload, error } = useSelector(getStatusFile);

  const type =
    fileType === "excel"
      ? fileTypes.excel
      : fileType === "image"
      ? fileTypes.image
      : "";

  const initialValues: TInitialValues = {
    file: null,
  };

  const form = useForm({
    mode: "uncontrolled",
    initialValues: initialValues,
  });

  const handleSubmit = () => {
    const { file } = form.getValues();
    if (file) dispatch(uploadFile(file));
  };

  useEffect(() => {
    if (error) dispatch(resetFilesErrors());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, form.getDirty()]);

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
        {error && <Alert message={error} type="error" />}
        <ButtonsDefaultFromForm
          loading={upload.loading}
          onClose={onClose}
          saveButtonLabel="Загрузить"
        />
      </div>
    </form>
  );
};

export default UploadFilesForm;
