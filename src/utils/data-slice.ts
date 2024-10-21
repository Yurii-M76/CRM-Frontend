export const dataSlice = <T>(
  array: T[],
  currentPage: number,
  rangeOnPage: number
): T[] => {
  const slice = array.slice(
    (currentPage - 1) * rangeOnPage,
    currentPage * rangeOnPage
  );
  return slice;
};
