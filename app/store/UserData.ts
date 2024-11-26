import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isLoggedIn: boolean;
    role: string | null;
    token: string | null;
    user_id: any | null; // tipni o'zingizning user modelingizga moslashtiring
    conut:Number
}

const initialState: AuthState = {
    isLoggedIn: false,
    role: null,
    token: null,
    user_id: null,
    conut:0
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{  token: string; role: string ; user_id:string}>) => {
            const {  token, role, user_id } = action.payload;
            state.token = token;
            state.role = role;
            state.isLoggedIn = true;
            state.user_id = user_id;
            state.conut=1
        },
        logout: (state) => {
            state.token = null;
            state.role = null;
            state.user_id = null;
            state.isLoggedIn = false;
            state.conut=2
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;