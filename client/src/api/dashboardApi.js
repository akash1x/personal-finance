import { api } from './api';

export const dashboardApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardSummary: builder.query({
            query: ({ month, year }) => `/dashboard?month=${month}&year=${year}`,
            providesTags: ['Transaction', 'Budget', 'Account'],
        }),
    }),
});

export const {
    useGetDashboardSummaryQuery,
} = dashboardApi;
