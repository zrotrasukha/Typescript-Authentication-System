import axios, { AxiosError } from 'axios';

const apiOptions = {
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
}

const API = axios.create(apiOptions);

API.interceptors.response.use((response) =>
    response.data,
    (error: AxiosError) => {
        const status = error.response?.status || 500;
        const data = error.response?.data || { message: 'Unknown error' };
        return Promise.reject({ status, ...data });
    })
export default API; 