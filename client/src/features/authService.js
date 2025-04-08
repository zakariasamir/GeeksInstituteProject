import axios from 'axios';


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const register = (data) => API.post('api/auth/register', data);
export const login = (data) => API.post('api/auth/login', data);
