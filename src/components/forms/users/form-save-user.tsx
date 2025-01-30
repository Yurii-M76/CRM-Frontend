import {
  ActionIcon,
  Anchor,
  Select,
  Switch,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { FC, useState } from "react";
import { TUser, UserRole } from "@/types";
import { useDispatch, useSelector } from "@/services/store";
import { createUser, updateUser } from "@/services/users/actions";
import { ButtonsDefaultFromForm, Alert } from "@/components";
import { getStatusUsers } from "@/services/users/reducer";
import exceptions from "@/constants/exceptions";
import * as Icons from "@assets/icons";
import classes from "../forms.module.css";

type TFormSaveUser = {
  onClose?: () => void;
  updData?: TUser;
  errors?: string | null;
};

type TInitialValues = {
  name: string;
  email: string;
  password: string;
  role: string | "";
  isBlocked: boolean;
};

const generatePassword = (): string => {
  const length = 12;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!'?@#$%^&*()_+";
  const parts = 4;
  const partLength = Math.floor(length / parts);
  const passwordParts = Array(parts)
    .fill(0)
    .map(() => {
      let part = "";
      for (let i = 0; i < partLength; i++) {
        part += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return part;
    });
  return passwordParts.join("-");
};

const FormSaveUser: FC<TFormSaveUser> = ({ onClose, updData, errors }) => {
  const dispatch = useDispatch();
  const status = useSelector(getStatusUsers);
  const isLoading = status.create.loading || status.update.loading;
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);

  const initialValues: TInitialValues = {
    name: updData?.name || "",
    email: updData?.email || "",
    password: updData?.password || "",
    role: updData?.role || "",
    isBlocked: updData?.isBlocked || false,
  };

  const isUpdData = updData ? true : false;

  const roles = Object.entries(UserRole).map(([key, label]) => ({
    value: key,
    label,
  }));

  const form = useForm({
    mode: "controlled",
    initialValues: initialValues,
    validate: {
      name: (value) =>
        value.length < 3
          ? exceptions.formValidate.users.moreLetters.name
          : null,
      email: (value) =>
        /^\S+@\S+$/.test(value)
          ? null
          : exceptions.formValidate.all.invalidInput,
      password: (value) =>
        updData
          ? null
          : value.length < 6
          ? exceptions.formValidate.users.moreLetters.password
          : null,
      role: (value) =>
        !value.length ? exceptions.formValidate.all.requiredField : null,
    },
  });

  const handleGeneratePassword = () => {
    form.setFieldValue("password", generatePassword());
  };

  const handleSubmit = () => {
    const sendData = {
      name: form.getValues().name,
      email: form.getValues().email,
      password: form.getValues().password || undefined,
      role: form.getValues().role,
      isBlocked: form.getValues().isBlocked,
    };

    if (updData) {
      dispatch(
        updateUser({
          id: updData.id,
          data: sendData,
        })
      );
    } else {
      dispatch(createUser(form.getValues()));
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(handleSubmit)}
      noValidate
      className={classes.form}
    >
      <div className={classes.inputsGroupOnColumn}>
        <TextInput
          id="name"
          label="Имя"
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <TextInput
          id="email"
          label="Email"
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
        <TextInput
          id="password"
          label={isChangePassword ? "Новый пароль" : "Пароль"}
          key={form.key("password")}
          {...form.getInputProps("password")}
          disabled={isUpdData && !isChangePassword}
          rightSection={
            <Tooltip label={"Сгенерировать"}>
              <ActionIcon
                variant="subtle"
                color="indigo"
                onClick={handleGeneratePassword}
                disabled={isUpdData && !isChangePassword}
              >
                <Icons.IconBrandSupabase strokeWidth={1.5} />
              </ActionIcon>
            </Tooltip>
          }
        />
        {isUpdData && (
          <Anchor
            size="sm"
            onClick={() => {
              setIsChangePassword(!isChangePassword);
              form.setFieldValue("password", "");
            }}
          >
            {!isChangePassword ? "Изменить пароль" : "Отменить"}
          </Anchor>
        )}
        <Select
          id="role"
          label="Роль"
          key={form.key("role")}
          {...form.getInputProps("role")}
          data={roles}
        ></Select>
        {isUpdData && (
          <Switch
            id="isBlocked"
            label="Заблокирован"
            key={form.key("isBlocked")}
            {...form.getInputProps("isBlocked")}
            defaultChecked={updData?.isBlocked}
            color="red"
            className={classes.inputHeight}
          />
        )}
      </div>
      {errors && <Alert type="error" message={errors} />}
      <ButtonsDefaultFromForm onClose={onClose} loading={isLoading} />
    </form>
  );
};

export default FormSaveUser;
