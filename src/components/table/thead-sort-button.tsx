import { Button, Tooltip } from "@mantine/core";
import { FC, useState } from "react";
import * as Icons from "../../assets/icons";
import classes from "../table/table.module.css";

type TProps = {
  accessor: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  resetSort: () => void;
  isDisabled: boolean;
};

export const THeadSortButton: FC<TProps> = ({
  accessor,
  sortBy,
  sortOrder,
  resetSort,
  isDisabled,
}) => {
  const [isResetSortButton, setIsResetSortButton] = useState(false);
  const resetSortIcon = () => <Icons.IconXboxX className={classes.icon} />;
  const handleSortClick = () => {
    resetSort();
    setIsResetSortButton(false);
  };
  const sortIcon = () => {
    if (!isResetSortButton) {
      if (sortOrder === "asc") {
        return <Icons.IconCircleArrowDown className={classes.icon} />;
      }
      if (sortOrder === "desc") {
        return <Icons.IconCircleArrowUp className={classes.icon} />;
      }
    } else {
      return resetSortIcon();
    }
  };
  return (
    sortBy === accessor && (
      <Tooltip label="Сбросить сортировку">
        <Button
          variant="light"
          color="blue"
          size="compact-sm"
          onClick={handleSortClick}
          onMouseEnter={() => setIsResetSortButton(true)}
          onMouseLeave={() => setIsResetSortButton(false)}
          disabled={isDisabled}
        >
          {sortIcon()}
        </Button>
      </Tooltip>
    )
  );
};
