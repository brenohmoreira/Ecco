import type { AxiosRequestConfig } from 'axios';
import { api } from '@/boot/axios';

// Helpers tipados que já retornam apenas o `data` da resposta
export const http = {
        get: <T>(url: string, config?: AxiosRequestConfig) =>
                api.get<T>(url, config).then((r) => r.data),
        post: <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
                api.post<T>(url, body, config).then((r) => r.data),
        put: <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
                api.put<T>(url, body, config).then((r) => r.data),
        patch: <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
                api.patch<T>(url, body, config).then((r) => r.data),
        delete: <T>(url: string, config?: AxiosRequestConfig) =>
                api.delete<T>(url, config).then((r) => r.data),
};
