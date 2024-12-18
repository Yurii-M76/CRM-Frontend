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
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return sortOrder === "asc" ? -1 : 1;
    if (bValue === null) return sortOrder === "asc" ? 1 : -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    } else if (Array.isArray(aValue) && Array.isArray(bValue)) {
      return sortOrder === "asc"
        ? aValue.length - bValue.length
        : bValue.length - aValue.length;
    } else if (typeof aValue === "object" && typeof bValue === "object") {
      return sortOrder === "asc"
        ? JSON.stringify(aValue).localeCompare(JSON.stringify(bValue))
        : JSON.stringify(bValue).localeCompare(JSON.stringify(aValue));
    } else {
      console.error("Sorting error");
      return 0;
    }
  });
};