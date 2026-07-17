import apiClient from "./client";

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post("/auth/login", credentials);
    console.log("DATA------>", response.data);
    return response.data;
  },
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};
