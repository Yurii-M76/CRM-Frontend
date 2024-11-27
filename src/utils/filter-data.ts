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

// export const filterData = <T>(data: T[], query: string, field: keyof T) => {
//   return data.filter((item) => {
//     const itemValue = item[field];
//     if (typeof itemValue === "string") {
//       return itemValue.toLowerCase().includes(query.trim().toLowerCase());
//     } else if (Array.isArray(itemValue)) {
//       return itemValue.some((val) =>
//         val.toString().toLowerCase().includes(query.trim().toLowerCase())
//       );
//     }
//     return false;
//   });
// };

// export const filterData = <T>(data: T[], query: string, fields: (keyof T)[]) => {
//   return data.filter((item) => {
//     return fields.some((field) => {
//       const itemValue = item[field];
//       if (typeof itemValue === "string") {
//         return itemValue.toLowerCase().includes(query.trim().toLowerCase());
//       } else if (Array.isArray(itemValue)) {
//         return itemValue.some((val) =>
//           val.toString().toLowerCase().includes(query.trim().toLowerCase())
//         );
//       }
//       return false;
//     });
//   });
// };

// export const filterData = <T>(data: T[], query: string, fields: (keyof T)[], isFullName?: boolean) => {
//   const normalizedQuery = query.trim().toLowerCase();

//   return data.filter((item) => {
//     const matchesFields = fields.some((field) => {
//       const itemValue = item[field];

//       if (typeof itemValue === "string") {
//         return itemValue.toLowerCase().includes(normalizedQuery);
//       } else if (Array.isArray(itemValue)) {
//         return itemValue.some((val) =>
//           val.toString().toLowerCase().includes(normalizedQuery)
//         );
//       }
//       return false;
//     });

//     // Дополнительная обработка для fullname
//     if (isFullName) {
//       const fullName = [item['surname'], item['name'], item['patronymic']].join(' ').toLowerCase();
//       return matchesFields || fullName.includes(normalizedQuery);
//     }
//   });
// };
