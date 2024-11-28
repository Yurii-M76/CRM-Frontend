import { Button, Tooltip } from "@mantine/core";
import {
  IconCircleArrowDown,
  IconCircleArrowUp,
  IconXboxX,
} from "@tabler/icons-react";
import { FC, useState } from "react";

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
  const resetSortIcon = () => <IconXboxX size={17} />;
  const handleSortClick = () => {
    resetSort();
    setIsResetSortButton(false);
  };
  const sortIcon = () => {
    if (!isResetSortButton) {
      if (sortOrder === "asc") {
        return <IconCircleArrowDown size={17} />;
      }
      if (sortOrder === "desc") {
        return <IconCircleArrowUp size={17} />;
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
