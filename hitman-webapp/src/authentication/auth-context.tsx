import { createContext } from "react";
import { AuthState, initialAuthState, User } from "./auth-state";
import axios, { AxiosInstance, AxiosResponse } from "axios";

export interface AuthContextInterface<TUser extends User = User>
  extends AuthState<TUser> {
  createUser: (
    username: string,
    password: string,
    firstName: string,
    lastName: string
  ) => void;
  login: (username: string, password: string) => Promise<AxiosResponse<any>>;
  refreshToken: () => Promise<AxiosResponse<any>>;
  client: AxiosInstance;
}

const stub = (): never => {
  throw new Error("You forgot to wrap your component in <AuthProvider>.");
};

const initialContext = {
  ...initialAuthState,
  createUser: stub,
  login: stub,
  refreshToken: stub,
  client: axios.create(),
};

const AuthContext = createContext<AuthContextInterface>(initialContext);

export default AuthContext;
