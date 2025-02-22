import ExcelJS from "exceljs";
import { formatDateToString } from "./format-date-to-string";

export async function excelToJson<T>(
  file: File | null,
  fieldNames: { [key: string]: string }
): Promise<T[] | undefined> {
  if (!file) return undefined;
  // Создаем новый экземпляр Workbook
  const workbook = new ExcelJS.Workbook();
  // Загружаем файл Excel
  await workbook.xlsx.load(await file.arrayBuffer());
  // Получаем первый лист
  const worksheet = workbook.worksheets[0];
  // Инициализируем массив для хранения данных
  const jsonData: T[] = [];
  // Формат для даты
  const formatDate = "YYYY-MM-DD";
  // Проверяем строку по паттерну даты
  const isDate = (value: string): boolean => {
    return /^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/.test(value);
  };

  // Получаем заголовки из первой строки и меняем их в соответствии с fieldNames
  const headers: (keyof T)[] = [];
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    const key =
      Object.entries(fieldNames).find(
        ([, label]) => cell.value === label
      )?.[0] ?? null;

    headers[colNumber - 1] = key as keyof T;
  });

  // При несоответствии заголовков с fieldNames - сообщаем об ошибке
  if (headers.some((item) => item === null)) {
    console.error("Один или несколько ключей не найдены");
    return [];
  } else {
    // Проходим по всем строкам, начиная со второй
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber > 1) {
        const rowData: Partial<T> = {};
        row.eachCell((cell, colNumber) => {
          if (cell.value) {
            const header = headers[colNumber - 1];
            const value = cell.value;
            if (header) {
              switch (typeof value) {
                case "string":
                  if (isDate(value)) {
                    const [day, month, year] = value.split(".");
                    rowData[header] = `${year}-${month}-${day}` as T[keyof T];
                  } else {
                    rowData[header] = value as T[keyof T];
                  }
                  break;
                case "object":
                  if (value instanceof Date) {
                    rowData[header] = formatDateToString(
                      value,
                      formatDate
                    ) as T[keyof T];
                  } else {
                    rowData[header] = Object.values(value)[0] as T[keyof T];
                  }
                  break;
                default:
                  rowData[header] = String(value) as T[keyof T];
              }
            }
          }
        });
        jsonData.push(rowData as T);
      }
    });
    return jsonData;
  }
}
