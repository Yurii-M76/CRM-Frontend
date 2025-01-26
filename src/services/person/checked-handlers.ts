import { PayloadAction } from "@reduxjs/toolkit";

export const handleAllChecked = (state: {
  items: { id: string }[];
  checkedIds: string[];
}) => {
  const allChecked = state.items.every((item) =>
    state.checkedIds.includes(item.id)
  );
  state.checkedIds = allChecked
    ? state.checkedIds.filter(
        (id) => !state.items.some((item) => item.id === id)
      )
    : [
        ...state.checkedIds,
        ...state.items
          .filter((item) => !state.checkedIds.includes(item.id))
          .map((item) => item.id),
      ];
};

export const handleOneChecked = (
  state: {
    items: { id: string }[];
    checkedIds: string[];
  },
  action: PayloadAction<string>
) => {
  const id = action.payload;
  state.checkedIds = state.checkedIds.includes(id)
    ? state.checkedIds.filter((item) => item !== id)
    : [...state.checkedIds, id];
};
