import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Use 10.0.2.2 for Android emulator to access PC localhost, otherwise localhost
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000/api";
  }
  return "http://localhost:5000/api";
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});
// Request interceptor to attach JWT token to all requests
apiClient.interceptors.request.use(
  async (config) => {
    // config.baseURL + config.url shows the full concatenated URL
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log("REQ---->", config.method?.toUpperCase(), fullUrl);
    try {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching token from SecureStore", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    console.log("RES---->", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log("API_ERR---->", error.response?.status, error.message);
    return Promise.reject(error);
  },
);

export default apiClient;
