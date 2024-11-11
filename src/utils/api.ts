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

type TVolunteer = {
  id: string;
  surname: string;
  name: string;
  patronymic: string;
  birthday: string;
  phone: string;
  email: string;
  rating: number;
  projects: JSON;
  createdAt: Date;
  updatedAt: Date;
};

export const getAllVolunteersApi = async () => {
  return await fetch(`${URL}/api/volunteers`, {
    mode: "cors",
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      authorization: await getValidAccessToken(),
    } as HeadersInit,
    credentials: "include",
  })
    .then((res) => {
      return checkResponse<TVolunteer[]>(res);
    })
    .then((data) => {
      if (data) return data;
      return Promise.reject(data);
    });
};

export const getOneVolunteerApi = async (id: string) => {
  return await fetch(`${URL}/api/volunteers`, {
    mode: "cors",
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      authorization: await getValidAccessToken(),
    } as HeadersInit,
    credentials: "include",
    body: JSON.stringify(id),
  })
    .then((res) => {
      return checkResponse<TVolunteer>(res);
    })
    .then((data) => {
      if (data) return data;
      return Promise.reject(data);
    });
};

export const updateVolunteerApi = async (
  id: string,
  data: Partial<TVolunteer>
) => {
  return await fetch(`${URL}/api/volunteers`, {
    mode: "cors",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      authorization: await getValidAccessToken(),
    } as HeadersInit,
    credentials: "include",
    body: JSON.stringify({ id, data }),
  })
    .then((res) => {
      return checkResponse<TVolunteer>(res);
    })
    .then((data) => {
      if (data) return data;
      return Promise.reject(data);
    });
};

export const deleteVolunteerApi = async (id: string) => {
  return await fetch(`${URL}/api/volunteers`, {
    mode: "cors",
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      authorization: await getValidAccessToken(),
    } as HeadersInit,
    credentials: "include",
    body: JSON.stringify(id),
  })
    .then((res) => {
      return checkResponse<{ id: string }>(res);
    })
    .then((data) => {
      if (data) return data;
      return Promise.reject(data);
    });
};
