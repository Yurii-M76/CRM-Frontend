import { useDispatch, useSelector } from "@/services/store";
import { getSortBy, getSortOrder, setSort } from "@/services/volunteer/reducer";
import { Button, Tooltip } from "@mantine/core";
import {
  IconCircleArrowDown,
  IconCircleArrowUp,
  IconXboxX,
} from "@tabler/icons-react";
import { FC, useState } from "react";

type TSortIcon = {
  accessor: string;
};

export const SortButton: FC<TSortIcon> = ({ accessor }) => {
  const dispatch = useDispatch();
  const [isResetSortButton, setIsResetSortButton] = useState(false);
  const sortOrder = useSelector(getSortOrder);
  const sortBy = useSelector(getSortBy);

  const handleSortClick = () => {
    dispatch(setSort({ sortBy: "createdAt", sortOrder: "asc" }));
    setIsResetSortButton(false);
  };

  const resetSortIcon = () => <IconXboxX size={17} />;
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
      <Tooltip label="Сбросить">
        <Button
          variant="light"
          color="blue"
          size="compact-sm"
          onClick={handleSortClick}
          onMouseEnter={() => setIsResetSortButton(true)}
          onMouseLeave={() => setIsResetSortButton(false)}
        >
          {sortIcon()}
        </Button>
      </Tooltip>
    )
  );
};
