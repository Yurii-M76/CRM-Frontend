import { Notification, Transition } from "@mantine/core";
import { useSelector } from "@/services/store";
import { getErrors } from "@/services/volunteer/reducer";

export const CRM_Notification = () => {
  const error = useSelector(getErrors);
  error?.includes("Failed")
  return (
    <Transition
      mounted={error ? true : false}
      transition={"fade-up"}
      duration={200}
      timingFunction="ease"
      keepMounted
    >
      {(transitionStyle) => (
        <Notification
          color={error?.includes("Failed") ? "red" : "gray"}
          title="Error"
          pos={"absolute"}
          bottom={20}
          right={16}
          pl={18}
          miw={300}
          maw={500}
          style={{ ...transitionStyle, zIndex: 99 }}
          withBorder
        >
          {error}
        </Notification>
      )}
    </Transition>
  );
};
