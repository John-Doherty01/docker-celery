export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthState<TUser extends User = User> {
  error?: Error;
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: TUser;
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
};
