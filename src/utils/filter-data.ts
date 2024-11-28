/**
 *
 * @param data входные данные
 * @param query строка запроса
 * @param field массив полей для поиска
 */
export const filterData = <T extends Record<string, unknown>>(
  data: T[],
  query: string,
  fields: (keyof T)[]
) => {
  const normalizedQuery = query.trim().toLowerCase();
  return data.filter((item) => {
    const concatenatedFields = fields
      .map((field) => {
        const value = item[field];
        // Проверяем существование значения и его тип
        return typeof value === "string"
          ? value
          : Array.isArray(value)
          ? value.join(" ")
          : "";
      })
      .join(" ")
      .toLowerCase();
    // Поиск в "склеенной" строке и по отдельным полям
    return (
      concatenatedFields.includes(normalizedQuery) ||
      fields.some((field) => {
        const itemValue = item[field];
        if (typeof itemValue === "string") {
          return itemValue.toLowerCase().includes(normalizedQuery);
        } else if (Array.isArray(itemValue)) {
          return itemValue.some((val) =>
            val.toString().toLowerCase().includes(normalizedQuery)
          );
        }
        return false;
      })
    );
  });
};
