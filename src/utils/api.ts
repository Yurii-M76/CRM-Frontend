import { getCookie } from "./cookie";
import { TUser } from "./types";

const HOST = import.meta.env.VITE_API_URL;
const PORT = import.meta.env.VITE_API_PORT;
const URL = `${HOST}:${PORT}`;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TServerResponse = {
  success: boolean;
  refreshToken: string;
  accessToken: string;
  user: string;
};

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  })
    .then((res) => checkResponse<TServerResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: "GET",
  }).then((res) => res.status);

export const getMeApi = () =>
  fetch(`${URL}/user/`, {
    method: "GET",
    headers: {
      authorization: getCookie("accessToken"),
    } as HeadersInit,
  })
    .then((res) => checkResponse<TUser>(res))
    .then((data) => {
      if (data) return data;
      return Promise.reject(data);
    });
