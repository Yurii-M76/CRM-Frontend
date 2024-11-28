import { Group, Text, Anchor } from "@mantine/core";
import { FC } from "react";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { useDispatch } from "@/services/store";

type TTableInfoBlock = {
  count: number;
  checkedIds: number;
  resetAllChecked?: ActionCreatorWithoutPayload<string>;
  entityTitle?: string;
};

export const TableInfoBlock: FC<TTableInfoBlock> = ({
  count,
  checkedIds,
  resetAllChecked,
  entityTitle = "записей",
}) => {
  const dispatch = useDispatch();
  const hasCheckedItems = checkedIds > 0;
  const checkedItemsText = hasCheckedItems ? ` / Выбрано: ${checkedIds} ` : "";
  const resetLink = resetAllChecked ? (
    <Anchor href="#" onClick={() => dispatch(resetAllChecked())}>
      [очистить]
    </Anchor>
  ) : null;
  const checkedItems = hasCheckedItems && (
    <>
      {checkedItemsText}
      {resetLink}
    </>
  );

  return (
    <Group c="dimmed" gap={5}>
      <Text>
        {`Всего ${entityTitle}: ${count}`}
        {checkedItems}
      </Text>
    </Group>
  );
};
