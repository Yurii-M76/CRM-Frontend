import { FC, ReactNode, useState } from "react";
import classes from "./scroll-block.module.css";
import { Anchor, Badge, Tooltip } from "@mantine/core";

type TScrollBlock = {
  height?: number;
  maxItems: number;
  totalItems: number;
  children: ReactNode;
};

export const ScrollBlock: FC<TScrollBlock> = ({
  height = 200,
  maxItems,
  totalItems,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const openButton =
    totalItems > maxItems ? (!isOpen ? "[развернуть]" : "[свернуть]") : null;

  const count = !isOpen && totalItems > 3 && (
    <div className={classes.count}>
      <Tooltip label="Количество">
        <Badge size="lg" variant="light" color="gray" circle>
          {totalItems}
        </Badge>
      </Tooltip>
    </div>
  );

  return (
    <>
      <div
        className={classes.scroll_block}
        style={{
          maxHeight: !isOpen ? "72px" : `${height}px`,
          overflowY: !isOpen ? "hidden" : "scroll",
        }}
      >
        {count}
        {children}
      </div>
      <Anchor size="md" onClick={() => setIsOpen(!isOpen)}>
        {openButton}
      </Anchor>
    </>
  );
};
