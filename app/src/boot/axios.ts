import { defineBoot } from '#q-app';
import axios, { type AxiosInstance } from 'axios';
import { Notify } from 'quasar';

declare module 'vue' {
        interface ComponentCustomProperties {
                $axios: AxiosInstance;
                $api: AxiosInstance;
        }
}

const api = axios.create({
        baseURL: import.meta.env.API_URL ?? '/api',
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
                config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
});

api.interceptors.response.use(
        (response) => response,
        (error: unknown) => {
                if (axios.isAxiosError(error)) {
                        const data = error.response?.data as { message?: string } | undefined;
                        Notify.create({
                                type: 'negative',
                                message:
                                        data?.message ??
                                        error.message ??
                                        'Erro inesperado na requisição',
                        });
                }
                return Promise.reject(error instanceof Error ? error : new Error(String(error)));
        },
);

export default defineBoot(({ app }) => {
        app.config.globalProperties.$axios = axios;
        app.config.globalProperties.$api = api;
});

export { api };
