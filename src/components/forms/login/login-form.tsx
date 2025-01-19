import {
  Box,
  Paper,
  Center,
  Divider,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  Text,
  PaperProps,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch, useSelector } from "@/services/store";
import { login } from "@/services/auth/action";
import { getAuthErrors, getIsLoadinAuth } from "@/services/auth/reducer";
import classes from "./login-form.module.css";

const LoginForm = (props: PaperProps) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoadinAuth);
  const errors = useSelector(getAuthErrors);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length < 6 ? "Password should include at least 6 characters" : null,
    },
  });

  const handleFormSubmit = () => {
    dispatch(login(form.values));
  };
  return (
    <Box className={classes.login_box}>
      <Paper
        radius="md"
        p="xl"
        w={360}
        withBorder
        {...props}
        className={classes.login_form}
      >
        <Center>
          <Text size="lg" fw={500}>
            Авторизация
          </Text>
        </Center>
        <Divider label="CRM" labelPosition="center" my="sm" />

        <form onSubmit={form.onSubmit(handleFormSubmit)}>
          <Stack>
            <TextInput
              required
              placeholder="name@mail.ru"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Неверный адрес электронной почты"}
            />

            <PasswordInput
              required
              placeholder="123456"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Пароль должен содержать не менее 6 символов"
              }
            />
          </Stack>

          <Center mt="xl">
            <Button type="submit" fullWidth loading={isLoading}>
              Войти
            </Button>
          </Center>
          {errors && (
            <Center pt={24}>
              <Text c="red" size="xs">
                {errors}
              </Text>
            </Center>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;