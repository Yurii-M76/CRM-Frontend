import { jwtDecode } from "jwt-decode";
import { getCookie, setCookie } from "./cookie";
import { TAuthResponse, TLoginData, TMe } from "@/types";

const HOST = import.meta.env.VITE_API_URL;
const PORT = import.meta.env.VITE_API_PORT;
const URL = `${HOST}:${PORT}`;

export const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

// Проверка актуальности access токена
const getValidAccessToken = async (): Promise<string> => {
  const token = getCookie("accessToken");
  if (!token) {
    const refreshedToken = await refreshTokens();
    return refreshedToken.accessToken;
  }
  const { exp } = jwtDecode(token);
  if (exp && Date.now() >= exp * 1000) {
    const refreshedToken = await refreshTokens();
    return refreshedToken.accessToken;
  }
  return token;
};

export const refreshTokens = async (): Promise<TAuthResponse> => {
  try {
    const response = await fetch(`${URL}/api/auth/refresh-tokens`, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: getCookie("accessToken"),
      } as HeadersInit,
      credentials: "include",
    });
    const data = await checkResponse<TAuthResponse>(response);
    setCookie("accessToken", data.accessToken);
    return data;
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    throw error;
  }
};

export const loginUserApi = async (data: TLoginData) => {
  try {
    const response = await fetch(`${URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
    });
    return await checkResponse<TAuthResponse>(response);
  } catch (error) {
    console.error("Request failed (login):", error);
    return Promise.reject(error);
  }
};

export const logoutUserApi = async () => {
  try {
    const response = await fetch(`${URL}/api/auth/logout`, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: await getValidAccessToken(),
      } as HeadersInit,
      credentials: "include",
    });
    if (response.ok) {
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error("Request failed (logout):", error);
    return Promise.reject(error);
  }
};

export const getMeApi = async () => {
  try {
    const response = await fetch(`${URL}/api/user`, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: await getValidAccessToken(),
      } as HeadersInit,
      credentials: "include",
    });
    return await checkResponse<TMe>(response);
  } catch (error) {
    console.error("Request failed (get me):", error);
    return Promise.reject(error);
  }
};

export const createDataFromApi = async <T>(
  path: string,
  data: Partial<T>
): Promise<T> => {
  try {
    const response = await fetch(`${URL}/api/${path}`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: await getValidAccessToken(),
      } as HeadersInit,
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await checkResponse<T>(response);
  } catch (error) {
    console.error(`Request failed (${path} create):`, error);
    return Promise.reject(error);
  }
};

export const getAllDataFromApi = async <T>(path: string): Promise<T> => {
  try {
    const response = await fetch(`${URL}/api/${path}`, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: await getValidAccessToken(),
      } as HeadersInit,
      credentials: "include",
    });
    return await checkResponse<T>(response);
  } catch (error) {
    console.error(`Request failed (${path} find all):`, error);
    return Promise.reject(error);
  }
};

export const getOneDataFromApi = async <T>(
  path: string,
  id: string
): Promise<T> => {
  try {
    const response = await fetch(`${URL}/api/${path}`, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: await getValidAccessToken(),
      } as HeadersInit,
      credentials: "include",
      body: JSON.stringify(id),
    });
    return await checkResponse<T>(response);
  } catch (error) {
    console.error(`Request failed (${path} find one):`, error);
    return Promise.reject(error);
  }
};

export const updateDataFromApi = async <T>(
  path: string,
  id: string,
  data: Partial<T>
): Promise<T> => {
  try {
    const response = await fetch(`${URL}/api/${path}/${id}`, {
      mode: "cors",
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: await getValidAccessToken(),
      } as HeadersInit,
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await checkResponse<T>(response);
  } catch (error) {
    console.error(`Request failed (${path} update):`, error);
    return Promise.reject(error);
  }
};

export const deleteDataFromApi = async <T>(
  path: string,
  id: string
): Promise<T> => {
  try {
    const response = await fetch(`${URL}/api/${path}/${id}`, {
      mode: "cors",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: await getValidAccessToken(),
      } as HeadersInit,
      credentials: "include",
    });
    return await checkResponse<T>(response);
  } catch (error) {
    console.error(`Request failed (${path} delete):`, error);
    return Promise.reject(error);
  }
};