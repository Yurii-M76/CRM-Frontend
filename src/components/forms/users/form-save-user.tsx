import { ActionIcon, Select, Switch, TextInput, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FC } from "react";
import { UserRole } from "@/types";
import { useDispatch, useSelector } from "@/services/store";
import { createUser } from "@/services/users/actions";
import { ButtonsDefaultFromForm } from "@/components/forms/elements/buttons";
import { getStatusUsers } from "@/services/users/reducer";
import exceptions from "@/constants/exceptions";
import * as Icons from "@assets/icons";
import classes from "../forms.module.css";

type TFormSaveUser = {
  onClose?: () => void;
};

type TInitialValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole | "";
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

const FormSaveUser: FC<TFormSaveUser> = ({ onClose }) => {
  const dispatch = useDispatch();
  const status = useSelector(getStatusUsers);
  const isLoadingCreate = status.create.loading;
  // const isLoadingUpdate = status.update.loading;

  const initialValues: TInitialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    isBlocked: false,
  };

  const roles = Object.entries(UserRole).map(([key, label]) => ({
    value: key,
    label,
  }));

  const form = useForm({
    mode: "uncontrolled",
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
        value.length < 6
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
    dispatch(createUser(form.getValues()));
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
          label="Пароль"
          key={form.key("password")}
          {...form.getInputProps("password")}
          rightSection={
            <Tooltip label="Сгенерировать пароль">
              <ActionIcon
                variant="subtle"
                color="indigo"
                onClick={handleGeneratePassword}
              >
                <Icons.IconbrandSupabase strokeWidth={1.5} />
              </ActionIcon>
            </Tooltip>
          }
        />
        <Select
          id="role"
          label="Роль"
          key={form.key("role")}
          {...form.getInputProps("role")}
          data={roles}
        ></Select>
        <Switch
          id="isBlocked"
          label="Заблокирован"
          key={form.key("isBlocked")}
          {...form.getInputProps("isBlocked")}
          defaultChecked={false}
          color="red"
          className={classes.inputHeight}
        />
      </div>
      <ButtonsDefaultFromForm onClose={onClose} loading={isLoadingCreate} />
    </form>
  );
};

export default FormSaveUser;
