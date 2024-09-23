export type Person = {
  id: number;
  name: string;
  birthday: string;
  city: string;
  phone: string;
};

export type Column = {
  label: string;
  accessor: keyof Person;
  sorted: boolean;
};
