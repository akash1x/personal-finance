import { api } from './api';

export const transactionApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTransactions: builder.query({
            query: ({ month, year }) => `/transaction/user?month=${month}&year=${year}`,
            providesTags: ['Transaction'],
        }),
        createTransaction: builder.mutation({
            query: (transactionData) => ({
                url: '/transaction',
                method: 'POST',
                body: transactionData,
            }),
            invalidatesTags: ['Transaction', 'Account', 'Budget'],
        }),
    }),
});

export const {
    useGetTransactionsQuery,
    useCreateTransactionMutation,
} = transactionApi;
