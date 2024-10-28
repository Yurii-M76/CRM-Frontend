import { checkResponse, TAuthResponse } from "./api";
import { getCookie, setCookie } from "./cookie";

export const refreshTokens = async () => {
  const response = await fetch(`${URL}/api/auth/refresh-tokens`, {
    credentials: "include", // отправка cookies с клиента
  });
  const refreshData = await checkResponse<TAuthResponse>(response);

  if (refreshData.success) {
    // Здесь нужно сохранить новый accessToken и refreshToken
    setCookie("accessToken", refreshData.accessToken);
    setCookie("refreshToken", refreshData.refreshToken.token);
    return refreshData;
  }

  return Promise.reject(refreshData);
};

const isTokenExpired = (token: string | undefined) => {
  if (!token) return true;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp * 1000 < Date.now();
};

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  // Проверка на истечение accessToken
  if (isTokenExpired(getCookie("accessToken"))) {
    const refreshData = await refreshTokens();
    if (refreshData.success) {
      // Обновляем accessToken в заголовках
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
        console.log(options.headers);
      }
    } else {
      return Promise.reject("Failed to refresh tokens");
    }
  }

  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if (err instanceof Response && (err.status === 401 || err.status === 403)) {
      // Если ошибка возникает при аутентификации, повторите процесс обновления токенов
      const refreshData = await refreshTokens();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      console.error("Fetch error:", err);
      return Promise.reject(err);
    }
  }
};
