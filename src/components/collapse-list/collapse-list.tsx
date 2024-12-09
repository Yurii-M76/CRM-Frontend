import { FC, ReactNode, useState } from "react";
import { Badge, Spoiler, Tooltip } from "@mantine/core";
import classes from "./collapse-list.module.css";

type TScrollBlock = {
  totalItems: number;
  children: ReactNode;
};

export const CollapseList: FC<TScrollBlock> = ({ totalItems, children }) => {
  const [expanded, setExpanded] = useState(false);

  const count = totalItems > 3 && !expanded && (
    <div className={classes.count}>
      <Tooltip label="Количество в списке">
        <Badge size="lg" variant="light" color="gray" circle>
          {totalItems}
        </Badge>
      </Tooltip>
    </div>
  );

  return (
    <div className={classes.scrollBlock}>
      <Spoiler
        maxHeight={72}
        showLabel="[развернуть]"
        hideLabel="[свернуть]"
        onExpandedChange={setExpanded}
      >
        <div className={expanded ? classes.scroll : undefined}>{children}</div>
      </Spoiler>
      <div className={classes.count}>{count}</div>
    </div>
  );
};
