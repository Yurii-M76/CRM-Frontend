import { jwtDecode } from "jwt-decode";
import { getCookie, setCookie } from "./cookie";

const HOST = import.meta.env.VITE_API_URL;
const PORT = import.meta.env.VITE_API_PORT;
const URL = `${HOST}:${PORT}`;

export const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

// Проверка актуальности access токена
const getValidAccessToken = async () => {
  const token = getCookie("accessToken");
  if (!token) {
    return (await refreshTokens()).accessToken;
  }
  const { exp } = jwtDecode(token); // npm i jwt-decode
  if (exp && Date.now() >= exp * 1000) {
    return (await refreshTokens()).accessToken;
  }
  return token;
};

export type TAuthResponse = {
  accessToken: string;
  refreshToken: {
    token: string;
    exp: string;
    userId: string;
  };
};

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = async (data: TLoginData) => {
  return await fetch(`${URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data) return data;
      return Promise.reject(data);
    });
};

export const logoutUserApi = async () => {
  return await fetch(`${URL}/api/auth/logout`, {
    mode: "cors",
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      authorization: await getValidAccessToken(),
    } as HeadersInit,
    credentials: "include",
  })
    .then(() => {
      return { success: true };
    })
    .catch((error) => Promise.reject(error));
};

export type TMe = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
};

export const getMeApi = async () => {
  return await fetch(`${URL}/api/user`, {
    mode: "cors",
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      authorization: await getValidAccessToken(),
    } as HeadersInit,
    credentials: "include",
  })
    .then((res) => {
      return checkResponse<TMe>(res);
    })
    .then((data) => {
      if (data) return data;
      return Promise.reject(data);
    });
};

export const refreshTokens = async () => {
  return await fetch(`${URL}/api/auth/refresh-tokens`, {
    mode: "cors",
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      authorization: getCookie("accessToken"),
    } as HeadersInit,
    credentials: "include",
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data) {
        setCookie("accessToken", data.accessToken);
        return data;
      }
      return Promise.reject(data);
    });
};
