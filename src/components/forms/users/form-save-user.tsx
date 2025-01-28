import {
  Anchor,
  PasswordInput,
  Select,
  Switch,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { FC } from "react";
import { UserRole } from "@/types";
import { useDispatch, useSelector } from "@/services/store";
import { createUser } from "@/services/users/actions";
import { ButtonsDefaultFromForm } from "@/components/forms/elements/buttons";
import { getStatusUsers } from "@/services/users/reducer";
import exceptions from "@/constants/exceptions";
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
        <PasswordInput
          id="password"
          label="Пароль"
          key={form.key("password")}
          {...form.getInputProps("password")}
        />
        <Anchor size="sm">Сгенерировать</Anchor>
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
