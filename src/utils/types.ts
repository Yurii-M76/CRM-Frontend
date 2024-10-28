export type TUser = {
  id: string;
  name: string;
  email: string;
  updateAt?: string;
  roles: string;
};

export type TVolunteer = {
  surname: string;
  name: string;
  patronymic: string;
  phone: string;
  email: string;
  rating: number;
};