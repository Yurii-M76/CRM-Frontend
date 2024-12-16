/**
 *
 * @param data входные данные
 * @param sortBy поле для сортировки
 * @param sortOrder направление сортировки
 * @returns результат сортирвки, если данные являются строкой / числом (в противном случае 0)
 */

export const sortData = <T>(
  data: T[],
  sortBy: keyof T,
  sortOrder: "asc" | "desc"
) => {
  if (!data.length) return data;
  return data.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    // Обработка случая, когда aValue или bValue равны null
    if (aValue === null && bValue === null) return 0; // оба null, равны
    if (aValue === null) return sortOrder === "asc" ? -1 : 1; // null считается меньшим
    if (bValue === null) return sortOrder === "asc" ? 1 : -1; // null считается меньшим

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    } else {
      console.error("Sorting error");
      return 0;
    }
  });
};
