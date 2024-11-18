export const dateFormatForTable = (data: string): string | null => {
  if (data) {
    const elem = data.split("-");
    return `${elem[2]}.${elem[1]}.${elem[0]}`;
  }
  return null;
};