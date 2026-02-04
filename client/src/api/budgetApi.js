import { api } from './api';

export const budgetApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getBudgetStatus: builder.query({
            query: ({ month, year }) => `/budget?month=${month}&year=${year}`,
            providesTags: ['Budget'],
        }),
        createBudget: builder.mutation({
            query: (budgetData) => ({
                url: '/budget',
                method: 'POST',
                body: budgetData,
            }),
            invalidatesTags: ['Budget'],
        }),
        updateBudget: builder.mutation({
            query: (budgetData) => ({
                url: '/budget',
                method: 'PUT',
                body: budgetData,
            }),
            invalidatesTags: ['Budget'],
        }),
    }),
});

export const {
    useGetBudgetStatusQuery,
    useCreateBudgetMutation,
    useUpdateBudgetMutation,
} = budgetApi;
