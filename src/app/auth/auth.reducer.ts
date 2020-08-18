import { AuthActions, SET_AUTHENTICATED, SET_UNAUTHENTICATED, UID } from "./auth.actions";

export interface State {
  isAuthenticated: boolean;
  uid: string;
}

const initialState: State = {
  isAuthenticated: false,
  uid: null,
};

export function authReducer(state = initialState, action: AuthActions) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return {
        ...state,
        isAuthenticated: false,
      };

    case UID:
      return {
        ...state,
        uid: action.payload,
      };

    default: {
      return state;
    }
  }
}

export const getIsAuth = (state: State) => state.isAuthenticated;
export const getUid = (state: State) => state.uid;
