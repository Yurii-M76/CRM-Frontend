export const formatName = (str: string | undefined): string => {
  if (!str) return "";
  const trimmedStr = str.trim();
  return trimmedStr.charAt(0).toUpperCase() + trimmedStr.slice(1).toLowerCase();
};
