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
