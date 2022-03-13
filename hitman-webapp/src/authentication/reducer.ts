import { AuthState } from "./auth-state";

type Action = {
  type: "REFRESHING" | "LOADING";
  value: boolean;
};

export const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case "REFRESHING":
      return {
        ...state,
        isRefreshing: action.value,
      };
    case "LOADING":
      return {
        ...state,
        isLoading: action.value,
      };
  }
};
