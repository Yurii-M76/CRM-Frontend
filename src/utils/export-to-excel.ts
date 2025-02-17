import * as XLSX from "xlsx";

export const exportToExcel = (
  sheetName: string,
  header: string[],
  data?: unknown[]
) => {
  // создаём новую книгу и лист
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data || []);
  // const headerRow = XLSX.utils.aoa_to_sheet([header], { cellStyles: true });

  // добавляем заголовки в лист
  XLSX.utils.sheet_add_json(worksheet, data || [], {
    skipHeader: true,
    origin: "A2",
  });
  XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: "A1" });

  // добавляем лист в книгу
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  // записываем в файл и запускаем загрузку
  XLSX.writeFile(workbook, `${sheetName}.xlsx`);
};
