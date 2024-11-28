/**
 * 
 * @param data входные данные в виде строки
 * @returns возвращает дату в формате "DD.MM.YYYY"
 */
export const dateFormatForTable = (data: string): string | null => {
  if (data && data.includes('-')) {
    const [year, month, day] = data.split('-');
    return `${day}.${month}.${year}`;
  }
  return null;
};