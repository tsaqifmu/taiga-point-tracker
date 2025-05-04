import axios from 'axios';

// Create axios instance
const taigaApi = axios.create({
  baseURL: 'http://34.101.148.210:9000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor to add the token to the headers if it exists
taigaApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const taigaService = {
  login: async (username: string, password: string) => {
    const response = await taigaApi.post('/auth', {
      username,
      password,
      type: 'normal',
    });
    return response.data;
  },
};
