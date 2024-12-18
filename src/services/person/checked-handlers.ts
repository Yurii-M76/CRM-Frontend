import { PayloadAction } from "@reduxjs/toolkit";

export const handleAllChecked = (state: {
  items: { id: string }[];
  checkedIds: string[];
}) => {
  const allChecked = state.items.every((item) => state.checkedIds.includes(item.id));
  state.checkedIds = allChecked
    ? state.checkedIds.filter((id) => !state.items.some((item) => item.id === id))
    : [...state.checkedIds, ...state.items.filter((item) => !state.checkedIds.includes(item.id)).map((item) => item.id)];
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

// import { PayloadAction } from "@reduxjs/toolkit";

// export const handleAllChecked = (state: {
//   items: { id: string }[];
//   checkedIds: string[];
// }) => {
//   // Проверяем, все ли текущие элементы уже выбраны
//   const allChecked = state.items.every((item) =>
//     state.checkedIds.includes(item.id)
//   );
//   if (allChecked) {
//     // Если все текущие элементы выбраны, снимаем отметки
//     state.checkedIds = state.checkedIds.filter(
//       (id) => !state.items.some((item) => item.id === id)
//     );
//   } else {
//     // Если есть невыбранные элементы, добавляем их в checkedIds
//     state.items.forEach((item) => {
//       if (!state.checkedIds.includes(item.id)) {
//         state.checkedIds.push(item.id);
//       }
//     });
//   }
// };

// export const handleOneChecked = (
//   state: {
//     items: { id: string }[];
//     checkedIds: string[];
//   },
//   action: PayloadAction<string>
// ) => {
//   const id = action.payload;
//   if (state.checkedIds.includes(id)) {
//     state.checkedIds = state.checkedIds.filter((item) => item !== id);
//   } else {
//     state.checkedIds.push(id);
//   }
// };
