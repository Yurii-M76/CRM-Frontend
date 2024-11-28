/**
 *
 * @param data входные данные
 * @param sortBy поле для сортировки
 * @param sortOrder направление сортировки
 * @returns результат сортирвки, если данные являются строкой / числом (в противном случае 0)
 */
export const sortData = <T>(data: T[], sortBy: keyof T, sortOrder: "asc" | "desc") => {
  if (!data.length) return data;
  return data.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc"
        ? aValue - bValue
        : bValue - aValue;
    } else {
      return 0;
    }
  });
};