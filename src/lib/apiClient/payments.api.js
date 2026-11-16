import { api } from './client';

export const paymentsApi = {
  createOrder: (data, opts) => api.post('/api/payment/create-order', data, opts),


};

export default paymentsApi;
