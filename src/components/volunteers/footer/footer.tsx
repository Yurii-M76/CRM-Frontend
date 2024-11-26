import { Anchor, Group, Text } from "@mantine/core";
import { FC } from "react";
import {
  getCountVolunteers,
  getRangeOnPage,
  resetAllChecked,
  setActivePage,
  setRangeOnPage,
} from "@/services/volunteer/reducer";
import { useDispatch, useSelector } from "@/services/store";
import classes from "./footer.module.css";
import { Paginator } from "@/components/paginator/paginator";

type TFooter = {
  checkedIds: number;
};

export const Footer: FC<TFooter> = ({ checkedIds }) => {
  const dispatch = useDispatch();
  const countVolunteers = useSelector(getCountVolunteers);
  const rowsOnPage = useSelector(getRangeOnPage);
  const checkedItems = checkedIds ? `/ Выбрано: ${checkedIds} ` : "";
  return (
    <div className={classes.footer}>
      <Group c="dimmed" gap={5}>
        <Text>{`Всего записей: ${countVolunteers}`}</Text>
        {checkedItems && (
          <Text>
            {checkedItems}
            <Anchor href="#" onClick={() => dispatch(resetAllChecked())}>
              [очистить]
            </Anchor>
          </Text>
        )}
      </Group>
      <Paginator
        count={countVolunteers}
        rowsOnPage={rowsOnPage}
        setActivePage={setActivePage}
        setRangeOnPage={setRangeOnPage}
      />
    </div>
  );
};
