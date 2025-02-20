import ExcelJS, { Column } from "exceljs";

/**
 *
 * @param data - unknow[]
 * @param columns - { header: string, key: string, width: number }[]
 * @param nestedLists - { key: string, label: string }[]
 * @param textFormat - boolean
 * @param filename - string
 */

export const exportToExcel = async <T>(
  data: T[],
  columns: Partial<Column>[],
  nestedLists: { key: string; label: string }[],
  textFormat: boolean,
  filename: string
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(filename);
  const dataLength = data.length;
  worksheet.columns = columns;

  if (dataLength) {
    data.forEach((row) => {
      worksheet.addRow(row);
    });
  }

  const headerStyle = { bold: true, color: { argb: "000000" } };
  worksheet.getRow(1).font = headerStyle;

  worksheet.addTable({
    name: `${filename}_table`,
    ref: `A1:${String.fromCharCode(65 + columns.length - 1)}${dataLength + 1}`,
    headerRow: true,
    totalsRow: false,
    style: {
      theme: "TableStyleLight15",
      showRowStripes: false,
    },
    columns: columns.map((column) => ({
      name: column.header as keyof Column,
      filterButton: true,
    })),
    rows: !dataLength
      ? [[]]
      : data.map((item) =>
          columns.map((column) => {
            const value = column.key as keyof T;
            if (Array.isArray(item[value])) {
              if (nestedLists.length) {
                const enumMatch = nestedLists.find(
                  (listItem) => column.key === listItem.key
                );
                return enumMatch
                  ? item[value]
                      .map((subItem) => subItem[enumMatch.label])
                      .join("; ")
                  : item[value].join("; ");
              } else {
                return "";
              }
            }
            return item[value];
          })
        ),
  });

  if (textFormat) {
    columns.forEach((_, index) => {
      worksheet.getColumn(index + 1).numFmt = "@"; // текстовый формат ячеек
    });
  }

  columns.forEach((_, index) => {
    worksheet.getColumn(index + 1).alignment = {
      vertical: "top",
      horizontal: "left",
      wrapText: true,
    }; // выравнивание и перенос текста в ячейке
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
