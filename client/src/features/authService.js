import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

export const register = (data) => API.post('api/auth/register', data);
export const login = (data) => API.post('api/auth/login', data);
