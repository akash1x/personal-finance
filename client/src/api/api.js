import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '../store/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, apiInstance, extraOptions) => {
    let result = await baseQuery(args, apiInstance, extraOptions);

    if (result?.error?.status === 401) {
        // Attempt to refresh the token
        const refreshResult = await baseQuery(
            { url: '/auth/refresh', method: 'POST' },
            apiInstance,
            extraOptions,
        );

        if (refreshResult?.data) {
            // Store the new access token
            apiInstance.dispatch(
                setCredentials({ token: refreshResult.data.token }),
            );
            // Retry the original request with the new token
            result = await baseQuery(args, apiInstance, extraOptions);
        } else {
            // Refresh failed — log the user out
            apiInstance.dispatch(logout());
        }
    }

    return result;
};

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Auth', 'User', 'Account', 'Transaction', 'Budget', 'ReceiptScan'],
    endpoints: () => ({}),
});
