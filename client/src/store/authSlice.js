import { createSlice } from '@reduxjs/toolkit';

const TOKEN_KEY = 'authToken';

// Initialize state from localStorage
const getInitialToken = () => {
    try {
        return localStorage.getItem(TOKEN_KEY) || null;
    } catch {
        return null;
    }
};

const initialState = {
    token: getInitialToken(),
    user: null,
    isAuthenticated: !!getInitialToken(),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { token, user } = action.payload;
            if (token) {
                state.token = token;
                state.isAuthenticated = true;
                try {
                    localStorage.setItem(TOKEN_KEY, token);
                } catch {
                    // Handle localStorage errors silently
                }
            }
            if (user) {
                state.user = user;
            }
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            try {
                localStorage.removeItem(TOKEN_KEY);
            } catch {
                // Handle localStorage errors silently
            }
        },
    },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
