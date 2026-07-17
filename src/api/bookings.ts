import apiClient from './client';

export const bookingService = {
  createBooking: async (bookingData: any) => {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
  },
  getBookings: async () => {
    const response = await apiClient.get('/bookings');
    return response.data;
  },
};
