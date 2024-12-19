import { Notification, Transition } from "@mantine/core";
import { useState } from "react";

export const CRM_Notification = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Transition
      mounted={isOpen}
      transition={"fade-up"}
      duration={200}
      timingFunction="ease"
      keepMounted
    >
      {(transitionStyle) => (
        <Notification
          color={"red"}
          title="Error"
          pos={"absolute"}
          bottom={20}
          right={16}
          pl={18}
          miw={300}
          maw={500}
          style={{ ...transitionStyle, zIndex: 999 }}
          withBorder
          onClose={() => setIsOpen(false)}
        >
          {"errors"}
        </Notification>
      )}
    </Transition>
  );
};
