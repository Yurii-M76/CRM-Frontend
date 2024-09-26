import { IconArrowBigDown, IconArrowBigUp } from "@tabler/icons-react";
import { Column } from "./types";
import { FC } from "react";

type TSortedIcon = {
  sortBy: string;
  column: Column;
  sortOrder: string;
};

const SortedIcon: FC<TSortedIcon> = ({ sortBy, column, sortOrder }) => {
  if (sortBy === column.accessor) {
    if (sortOrder === "asc") {
      return (
        <IconArrowBigUp
          style={{ width: "14px", height: "14px", color: "lightcoral" }}
          stroke={1.5}
        />
      );
    }

    if (sortOrder === "desc") {
      return (
        <IconArrowBigDown
          style={{ width: "14px", height: "14px", color: "lightcoral" }}
          stroke={1.5}
        />
      );
    }
  }

  return null;
};

export default SortedIcon;
