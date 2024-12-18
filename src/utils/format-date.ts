/**
 *
 * @param date входные данные
 * @param param ("asc" | "desc") форматирует дату в строку вида "DD.MM.YYYY" или YYYY-MM-DD соответственно
 */

export const formatDateToString = (
  date: Date | undefined,
  param: "asc" | "desc"
): string | undefined => {
  if (date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    if (param === "asc") return `${day}.${month}.${year}`;
    if (param === "desc") return `${year}-${month}-${day}`;
  }
  return undefined;
};
