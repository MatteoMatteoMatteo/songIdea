import * as fromUi from "./uiHelper/ui.reducer";
import * as fromAuth from "./auth/auth.reducer";
import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";

export interface State {
  ui: fromUi.State;
  auth: fromAuth.State;
}

export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.authReducer,
  ui: fromUi.uiReducer,
};

export const getUiState = createFeatureSelector<fromUi.State>("ui");
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

export const getAuthState = createFeatureSelector<fromAuth.State>("auth");
export const getIsAuth = createSelector(getAuthState, fromAuth.getIsAuth);
export const getUid = createSelector(getAuthState, (state: fromAuth.State) => state.uid);
