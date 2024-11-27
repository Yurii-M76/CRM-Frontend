/**
 *
 * @param data входные данные
 * @param sortBy поле для сортировки
 * @param sortOrder направление сортировки
 * @returns результат сортирвки, если данные являются строкой / числом (в противном случае 0)
 */
export const sortData = <T>(data: T[], sortBy: keyof T, sortOrder: string) => {
  return data.sort((a, b) => {
    if (typeof a[sortBy] === "string" && typeof b[sortBy] === "string") {
      return sortOrder === "asc"
        ? a[sortBy].localeCompare(b[sortBy])
        : b[sortBy].localeCompare(a[sortBy]);
    } else if (typeof a[sortBy] === "number" && typeof b[sortBy] === "number") {
      return sortOrder === "asc"
        ? a[sortBy] - b[sortBy]
        : b[sortBy] - a[sortBy];
    } else {
      return 0;
    }
  });
};