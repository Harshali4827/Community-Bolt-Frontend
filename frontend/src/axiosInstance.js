import axios from 'axios';
import config from './config';

const axiosInstance = axios.create({
  baseURL: config.baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });
  
export default axiosInstance;
