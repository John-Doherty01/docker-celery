import { AuthState } from "./auth-state";

type Action = {
  type: "LOADING";
  value: boolean;
};

export const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        isLoading: action.value,
      };
  }
};
