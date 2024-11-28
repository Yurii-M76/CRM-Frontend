import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from "@reduxjs/toolkit";
import { CloseButton, TextInput } from "@mantine/core";
import { useDispatch } from "@/services/store";
import { useForm } from "@mantine/form";
import { Form } from "react-router-dom";
import { FC } from "react";

type TSearch = {
  query: ActionCreatorWithPayload<string>;
  reset: ActionCreatorWithoutPayload;
};

export const Search: FC<TSearch> = ({ query, reset }) => {
  const dispatch = useDispatch();
  const form = useForm({ mode: "uncontrolled", initialValues: { search: "" } });
  const handleSubmit = (values: typeof form.values) => {
    if (form.getValues().search !== "") {
      dispatch(query(values.search));
    } else {
      dispatch(reset());
    }
  };
  const formReset = () => {
    dispatch(reset());
    form.setFieldValue("search", "");
  };
  return (
    <Form onSubmit={form.onSubmit(handleSubmit)} aria-label="Поиск">
      <TextInput
        placeholder="Найти... + Enter"
        miw="340px"
        rightSection={
          <CloseButton
            aria-label="Очистить поиск"
            onClick={() => formReset()}
            style={{ display: form.getValues().search ? undefined : "none" }}
          />
        }
        key={form.key("search")}
        {...form.getInputProps("search")}
      />
    </Form>
  );
};
