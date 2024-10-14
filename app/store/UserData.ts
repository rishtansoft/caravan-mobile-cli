import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  role: string | null; 
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string; role: string }>) => {
      state.isLoggedIn = true;
      state.token = action.payload.token; 
      state.role = action.payload.role;  
    },
    logoutSuccess: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.role = null; 
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

export const login = (token: string, role: string) => async (dispatch: any) => {
  dispatch(loginSuccess({ token, role }));
};

export const logout = () => async (dispatch: any) => {
  dispatch(logoutSuccess());
};

export default authSlice.reducer;
