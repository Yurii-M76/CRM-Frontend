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
  const hasCheckedItems = checkedIds > 0;
  const checkedItemsText = hasCheckedItems ? `/ Выбрано: ${checkedIds} ` : "";
  const resetLink = resetAllChecked ? (
    <Anchor href="#" onClick={() => dispatch(resetAllChecked())}>
      [очистить]
    </Anchor>
  ) : null;

  return (
    <Group c="dimmed" gap={5}>
      <Text>{`Всего записей: ${count}`}</Text>
      {hasCheckedItems && (
        <Text>
          {checkedItemsText}
          {resetLink}
        </Text>
      )}
    </Group>
  );
};
