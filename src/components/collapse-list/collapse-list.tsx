import { FC, ReactNode, useState } from "react";
import { Badge, Spoiler, Tooltip } from "@mantine/core";
import classes from "./collapse-list.module.css";

type TScrollBlock = {
  totalItems: number;
  children: ReactNode;
};

const CollapseList: FC<TScrollBlock> = ({ totalItems, children }) => {
  const [expanded, setExpanded] = useState(false);

  const count = !expanded && totalItems > 1 && (
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
        maxHeight={74}
        w={"100%"}
        showLabel="[развернуть]"
        hideLabel="[свернуть]"
        onExpandedChange={setExpanded}
      >
        <div className={expanded ? classes.scroll : undefined}>{children}</div>
      </Spoiler>
      {count}
    </div>
  );
};

export default CollapseList;