import axios from 'axios';

// When running with Vite proxy or direct API URL
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';

    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.request && !error.response) {
      message = 'Unable to reach the server. Please check your backend connection.';
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;

