import { api } from './api';

export const receiptScanApi = api.injectEndpoints({
    endpoints: (builder) => ({
        scanReceipt: builder.mutation({
            query: (file) => {
                const formData = new FormData();
                formData.append('receipt', file);
                return {
                    url: '/receipt-scan/upload',
                    method: 'POST',
                    body: formData,
                };
            },
        }),
    }),
});

export const { useScanReceiptMutation } = receiptScanApi;
