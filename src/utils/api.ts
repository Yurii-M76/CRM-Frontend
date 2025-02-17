import { jwtDecode } from "jwt-decode";
import { getCookie, setCookie } from "./cookie";
import { TAuthResponse, TLoginData, TUser } from "@/types";

const URL = import.meta.env.VITE_API_URL;

export const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

let isRefreshing = false; // Флаг для отслеживания процесса обновления токенов
let pendingRequests: Array<(token: string) => void> = []; // Массив для хранения ожидающих запросов

// Проверка актуальности access токена
const getValidAccessToken = async () => {
  const token = getCookie("accessToken");
  if (token) {
    const { exp } = jwtDecode(token);
    if (exp && Date.now() >= exp * 1000) {
      if (!isRefreshing) {
        isRefreshing = true; // Устанавливаем флаг, что обновление начато
        try {
          const newToken = (await refreshTokens()).accessToken;
          pendingRequests.forEach((callback) => callback(newToken)); // Разрешаем все ожидающие запросы
          pendingRequests = []; // Очищаем массив ожидающих запросов
          return newToken;
        } finally {
          isRefreshing = false; // Сбрасываем флаг после завершения обновления
        }
      } else {
        // Если обновление уже происходит, возвращаем промис
        return new Promise((resolve) => {
          pendingRequests.push(resolve); // Добавляем текущий запрос в массив ожидания
        });
      }
    }
  }
  return token;
};

export const refreshTokens = async (): Promise<TAuthResponse> => {
  try {
    const token = getCookie("refreshToken");
    const response = await fetch(`${URL}/api/auth/refresh-tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      } as HeadersInit,
      body: JSON.stringify({ refreshToken: token }),
    });
    const data = await checkResponse<TAuthResponse>(response);
    setCookie("accessToken", data.accessToken);
    setCookie("refreshToken", data.refreshToken.token);
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
    const token = getCookie("refreshToken");
    if (token) {
      const response = await fetch(`${URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        } as HeadersInit,
        body: JSON.stringify({ refreshToken: token }),
      });
      if (response.ok) {
        return { success: true };
      }
    }
    return { success: false };
  } catch (error) {
    console.error("Request failed (logout):", error);
    return Promise.reject(error);
  }
};

export const getMeApi = async (id: string) => {
  try {
    const response = await fetch(`${URL}/api/users/${id}`, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: await getValidAccessToken(),
      } as HeadersInit,
      credentials: "include",
    });
    return await checkResponse<TUser>(response);
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
  idOrEmail: string
): Promise<T> => {
  try {
    const response = await fetch(`${URL}/api/${path}/${idOrEmail}`, {
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

export const findPhoneOnPersonsFromApi = async <T>(
  phone: string
): Promise<T> => {
  try {
    const response = await fetch(`${URL}/api/persons/phone/${phone}`, {
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
    console.error(`Request failed (find persons/phone):`, error);
    return Promise.reject(error);
  }
};

export const findEmailOnPersonsFromApi = async <T>(
  email: string
): Promise<T> => {
  try {
    const response = await fetch(`${URL}/api/persons/email/${email}`, {
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
    console.error(`Request failed (find persons/email):`, error);
    return Promise.reject(error);
  }
};

export const uploadFileOnApi = async (
  path: string,
  file: File
): Promise<File> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${URL}/api/${path}`, {
      mode: "cors",
      method: "POST",
      headers: {
        authorization: await getValidAccessToken(),
      } as HeadersInit,
      credentials: "include",
      body: formData,
    });
    return await checkResponse(response);
  } catch (error) {
    console.error(`Request failed (${path} upload file):`, error);
    return Promise.reject(error);
  }
};
