import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from "@reduxjs/toolkit";
import { ActionIcon, TextInput } from "@mantine/core";
import { useDispatch } from "@/services/store";
import { useForm } from "@mantine/form";
import { Form } from "react-router-dom";
import { FC, useState } from "react";
import * as Icons from "@assets/icons";
import classes from "./search.module.css";

type TSearch = {
  query: ActionCreatorWithPayload<string>;
  reset: ActionCreatorWithoutPayload;
  isDisabled?: boolean;
};

const Search: FC<TSearch> = ({ query, reset, isDisabled }) => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const dispatch = useDispatch();
  const form = useForm({ mode: "uncontrolled", initialValues: { search: "" } });

  const handleSubmit = (values: typeof form.values) => {
    if (form.getValues().search !== "") {
      setIsSubmit(true);
      dispatch(query(values.search));
    } else {
      setIsSubmit(false);
      dispatch(reset());
    }
  };
  const formReset = () => {
    dispatch(reset());
    form.setFieldValue("search", "");
    setIsSubmit(false);
  };

  const searchButton = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => handleSubmit({ search: form.getValues().search })}
    >
      <Icons.IconSearch className={classes.IconSearch} />
    </ActionIcon>
  );

  const closeButton = (
    <ActionIcon variant="subtle" color="gray" onClick={() => formReset()}>
      <Icons.IconX className={classes.IconSearch} />
    </ActionIcon>
  );

  return (
    <Form onSubmit={form.onSubmit(handleSubmit)} aria-label="Поиск">
      <TextInput
        disabled={isDisabled}
        placeholder="Найти..."
        miw="340px"
        rightSection={isSubmit ? closeButton : searchButton}
        key={form.key("search")}
        {...form.getInputProps("search")}
      />
    </Form>
  );
};

export default Search;
