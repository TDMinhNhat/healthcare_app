import axios from "axios";

const API_URL = `https://${import.meta.env.VITE_HOST}`;
const axiosConfig = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosConfig.interceptors.request.use(
  async (config) => {
    // Promise.resolve(getAccessToken()).then((accessToken) => {
    //   config.headers.Authorization = `Bearer ${accessToken}`;
    // });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // const refreshToken = await TokenService.getRefreshToken();
      // if (refreshToken) {
      // try {
      //   const response = await axiosConfig.post('/refreshToken', {
      //     refreshToken,
      //   });
      //   const newAccessToken = response?.data?.accessToken;
      //   setAccessToken(newAccessToken);
      //   return axiosConfig(originalRequest);
      // } catch (error) {
      //   console.error('Error refreshing token:', error);
      //   return Promise.reject(error);
      // }
      // }
    }
    return Promise.reject(error?.response?.data);
  }
);

export default axiosConfig;
