import { deleteCookie, getCookie } from "./cookie";
import { fetchWithRefresh } from "./refresh-tokens";
import { TVolunteer } from "./types";

const HOST = import.meta.env.VITE_API_URL;
const PORT = import.meta.env.VITE_API_PORT;
const URL = `${HOST}:${PORT}`;

export const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TRefreshToken = {
  token: string;
  exp: string;
  userId: string;
  userAgent: string;
};

export type TLoginData = {
  email: string;
  password: string;
};

export type TAuthResponse = {
  refreshToken: TRefreshToken;
  accessToken: string;
  success: boolean;
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

type TVolunteerResponse = {
  count: number;
  items: TVolunteer[];
};

export const getVolunteersApi = () =>
  fetchWithRefresh<TVolunteerResponse>(`${URL}/api/volunteers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      authorization: getCookie("accessToken"),
    } as HeadersInit,
  }).then((data) => {
    if (data) return data;
    return Promise.reject(data);
  });

// export const getVolunteersApi = async (): Promise<TVolunteerResponse> => {
//   const res = await fetch(`${URL}/api/volunteers`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//       authorization: getCookie("accessToken"),
//     } as HeadersInit,
//   });
//   try {
//     const data = await checkResponse<TVolunteerResponse>(res);
//     if (data) return data;
//     refreshTokens();
//   } catch (error) {
//     console.log("ошибка авторизации");
//   }

// const data = await checkResponse<TVolunteerResponse>(res);
// if (data) return data;
// return Promise.reject(data);
// };
