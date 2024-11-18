export const dateFormat = (inputDateStr: string): string => {
  if (!inputDateStr) {
    return "";
  }
  const date = new Date(inputDateStr);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format"); //Обработка некорректного ввода
  }
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы нумеруются с 0!
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};
