export const pagination = <T>(
  data: T[],
  activePage: number,
  rangeOnPage: number
): T[] => {
  return [...data].slice(
    (activePage - 1) * rangeOnPage,
    activePage * rangeOnPage
  );
};