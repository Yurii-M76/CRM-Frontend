/**
 *
 * @param date дата (2025-01-01T08:00:00.853Z)
 * @param param формат даты ("DD.MM.YYYY" | "YYYY-MM-DD" | "day_month" | "day_month_year")
 */

export const formatDateToString = (
  date: Date | undefined,
  format: "DD.MM.YYYY" | "YYYY-MM-DD" | "day_month" | "day_month_year"
): string => {
  if (!date) return "";
  const day = new Date(date).getDate().toString().padStart(2, "0");
  const month = (new Date(date).getMonth() + 1).toString().padStart(2, "0");
  const year = new Date(date).getFullYear();
  const monthName = months[+month - 1];

  switch (format) {
    case "DD.MM.YYYY":
      return `${day}.${month}.${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "day_month":
      return `${day} ${monthName}`;
    case "day_month_year":
      return `${day} ${monthName} ${year}`;
  }
};

const months = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сертября",
  "октября",
  "ноября",
  "декабря",
];
