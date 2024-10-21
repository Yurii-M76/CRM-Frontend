import { deleteCookie, getCookie } from "./cookie";

const HOST = import.meta.env.VITE_API_URL;
const PORT = import.meta.env.VITE_API_PORT;
const URL = `${HOST}:${PORT}`;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TRefreshToken = {
  token: string;
  exp: string;
  userId: string;
  userAgent: string;
};

type TAuthResponse = {
  refreshToken: TRefreshToken;
  accessToken: string;
  success: boolean;
};

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data.success) return data;
      return Promise.reject(data);
    });

export const logoutApi = () =>
  fetch(`${URL}/api/auth/logout`, {
    method: "GET",
  }).then((res) => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    return res.status;
  });

export const refreshTokens = () =>
  fetch(`${URL}/api/auth/refresh-tokens`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      authorization: getCookie("accessToken"),
    } as HeadersInit,
    credentials: "include", // отправка cookies с клиента
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((refreshData) => {
      if (refreshData.success) {
        return refreshData;
      }
      return Promise.reject(refreshData);
    });
