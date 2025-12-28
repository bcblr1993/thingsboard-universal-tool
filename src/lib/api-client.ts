import axios, { AxiosInstance } from 'axios';

// We need a factory because the Base URL changes depending on the selected environment.
export const createApiClient = (baseURL: string, token?: string): AxiosInstance => {
    const api = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (token) {
        api.defaults.headers.common['X-Authorization'] = `Bearer ${token}`;
    }

    // Response interceptor
    api.interceptors.response.use(
        (response) => response.data,
        (error) => {
            const message = error.response?.data?.message || error.message;
            console.error('API Error:', message);
            return Promise.reject(error);
        }
    );

    return api;
};
