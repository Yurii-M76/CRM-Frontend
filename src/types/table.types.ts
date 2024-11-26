export type Column<T> = {
  label: string;
  accessor: keyof T;
  sorted: boolean;
  size: number;
};