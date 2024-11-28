/**
 * 
 * @param data массив данных
 * @param activePage текущая страница
 * @param rangeOnPage количество записей на странице
 * @returns возвращает копию массива в соответствии с параметрами activePage и rangeOnPage
 */
export const pagination = <T>(
  data: T[],
  activePage: number,
  rangeOnPage: number
): T[] => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  const startIndex = (activePage - 1) * rangeOnPage;
  const endIndex = activePage * rangeOnPage;
  return [...data].slice(startIndex, endIndex);
};