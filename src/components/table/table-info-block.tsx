import { Group, Text, Anchor } from "@mantine/core";
import { FC } from "react";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { useDispatch } from "@/services/store";

type TTableInfoBlock = {
  count: number;
  checkedIds: number;
  resetAllChecked?: ActionCreatorWithoutPayload<string>;
};

export const TableInfoBlock: FC<TTableInfoBlock> = ({
  count,
  checkedIds,
  resetAllChecked,
}) => {
  const dispatch = useDispatch();
  const checkedItems = checkedIds ? `/ Выбрано: ${checkedIds} ` : "";
  return (
    <Group c="dimmed" gap={5}>
      <Text>{`Всего записей: ${count}`}</Text>
      {checkedItems && (
        <Text>
          {checkedItems}
          {resetAllChecked && (
            <Anchor href="#" onClick={() => dispatch(resetAllChecked())}>
              [очистить]
            </Anchor>
          )}
        </Text>
      )}
    </Group>
  );
};
