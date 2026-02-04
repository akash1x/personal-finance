import { api } from './api';

export const accountApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAccounts: builder.query({
            query: () => '/account',
            providesTags: ['Account'],
        }),
        createAccount: builder.mutation({
            query: (accountData) => ({
                url: '/account',
                method: 'POST',
                body: accountData,
            }),
            invalidatesTags: ['Account'],
        }),
    }),
});

export const {
    useGetAccountsQuery,
    useCreateAccountMutation,
} = accountApi;
