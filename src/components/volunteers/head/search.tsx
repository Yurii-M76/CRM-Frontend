import { useDispatch } from "@/services/store";
import { TextInput, CloseButton } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Form } from "react-router-dom";
import { resetSearch, setSearch } from "@/services/volunteer/reducer";

export const Search = () => {
  const dispatch = useDispatch();
  const form = useForm({ mode: "uncontrolled", initialValues: { search: "" } });
  const handleSubmit = (values: typeof form.values) => {
    if (form.getValues().search !== "") {
      dispatch(setSearch(values.search));
    } else {
      dispatch(resetSearch());
    }
  };
  const formReset = () => {
    dispatch(resetSearch());
    form.setFieldValue("search", "");
  };
  return (
    <Form onSubmit={form.onSubmit(handleSubmit)} aria-label="Поиск">
      <TextInput
        placeholder="Искать... + Enter"
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
