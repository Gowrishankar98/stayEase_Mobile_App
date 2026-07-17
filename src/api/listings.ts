import apiClient from './client';

export const listingService = {
  getApartments: async (params?: Record<string, any>) => {
    const response = await apiClient.get('/properties', { params });
    return response.data;
  },
  getApartmentById: async (id: string) => {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data;
  },
};
