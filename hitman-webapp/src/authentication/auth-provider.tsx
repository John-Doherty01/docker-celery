import React, { useCallback, useContext, useMemo, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext, { AuthContextInterface } from "./auth-context";
import { reducer } from "./reducer";
import { initialAuthState, User } from "./auth-state";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  TOKEN_LOCALSTORAGE_KEY,
} from "./auth";

interface AuthProviderOptions {
  children?: React.ReactNode;
}

let refreshPromise: Promise<AxiosResponse<any, any>> | null = null;

export const AuthProvider = (opts: AuthProviderOptions): JSX.Element => {
  const { children } = opts;
  const HOST_URL = process.env.REACT_APP_API_HOST_URL || "http://localhost:8000/";
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID || "FSb5TMUaS4GSdaFjj1M8kfwec2vxe7EH3eO8pdcx";
  const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET || "0KobqEc4etm10YU3IeEdJ9k0Pv6GTuUl8UO15WnrlkkIgJ9MgVZqzCApFTWSaURudxlDj3gIUJcwkPXcORV1i1kcGrEXDXF2rxNMWtm4Hr6iuNDncp3c5g7P5BMY8mo7";

  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const navigate = useNavigate();
  const refreshToken = useCallback((): Promise<AxiosResponse<any>> => {
    const local = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);
    return new Promise<AxiosResponse<any>>((resolve, reject) => {
      if (local === null) {
        reject("already refreshing or localstorage token not found");
        return;
      }
      const token = JSON.parse(local);
      const url = HOST_URL + "o/token/";
      const request = axios.post(
        url,
        new URLSearchParams({
          refresh_token: token.refresh_token,
          grant_type: "refresh_token",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      request
        .then((res) => {
          const token = JSON.stringify(res.data);
          localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, token);
          resolve(res);
        })
        .catch((err) => {
          navigate("/login", { replace: true });
          reject(err);
        });
    });
  }, [CLIENT_ID, CLIENT_SECRET, HOST_URL, navigate]);

  const getClient = useCallback((): AxiosInstance => {
    const newInstance = axios.create();
    newInstance.interceptors.request.use((config) => {
      const local = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);
      if (!config.url?.includes(HOST_URL)) config.url = HOST_URL + config.url;
      dispatch({ type: "LOADING", value: true });
      if (local === null) return config;
      const token = JSON.parse(local).access_token;
      if (token && config.headers !== undefined) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    newInstance.interceptors.response.use(
      (response) => {
        dispatch({ type: "LOADING", value: false });
        return response;
      },
      async (error) => {
        dispatch({ type: "LOADING", value: false });
        const originalRequest = error.config;
        if (error.response === undefined) return Promise.reject(error);
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          if (refreshPromise === null) {
            const prom = refreshToken().then((res) => {
              refreshPromise = null;
              return res;
            });
            refreshPromise = prom;
            await prom;
          } else {
            await refreshPromise;
          }

          return newInstance(originalRequest);
        }
        return Promise.reject(error);
      }
    );
    return newInstance;
  }, [HOST_URL, refreshToken]);

  const login = useCallback(
    (username: string, password: string): Promise<AxiosResponse<any>> => {
      const url = HOST_URL + "o/token/";
      const request = axios.post(
        url,
        new URLSearchParams({
          username: username,
          password: password,
          grant_type: "password",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return new Promise<AxiosResponse<any>>((resolve, reject) => {
        request
          .then((res) => {
            const token = JSON.stringify(res.data);
            localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, token);
            navigate("/", { replace: true });
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    [CLIENT_ID, CLIENT_SECRET, HOST_URL, navigate]
  );

  const createUser = useCallback(
    async (
      username: string,
      password: string,
      firstName: string,
      lastName: string
    ) => {
      const url = HOST_URL + "user/create";
      const request = axios.post(
        url,
        {
          username: username,
          password: password,
          first_name: firstName,
          last_name: lastName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await request;
      await login(username, password);
    },
    [HOST_URL, login]
  );

  const contextValue = useMemo(() => {
    return {
      ...state,
      refreshToken,
      login,
      createUser,
      getClient,
    };
  }, [state, refreshToken, login, createUser, getClient]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = <
  TUser extends User = User
>(): AuthContextInterface<TUser> =>
  useContext(AuthContext) as AuthContextInterface<TUser>;
