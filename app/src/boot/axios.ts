import { defineBoot } from '#q-app';
import { useAutenticacaoStore } from '@/stores/autenticacao';
import axios, { type AxiosInstance } from 'axios';
import { Notify } from 'quasar';

declare module 'vue' {
        interface ComponentCustomProperties {
                $axios: AxiosInstance;
                $api: AxiosInstance;
        }
}

const api = axios.create({
        baseURL: import.meta.env.QCLI_API_URL ?? '/api',
        timeout: 15000,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
});

export default defineBoot(({ app, router, store }) => {
        api.interceptors.response.use(
                (response) => response,
                (error: unknown) => {
                        if (axios.isAxiosError(error)) {
                                const status = error.response?.status;
                                const url = error.config?.url;

                                console.log(error)

                                if (status === 401 && url === '/autenticacao/eu') {
                                        Notify.create({ type: 'negative', message: 'Conecte-se para prosseguir' })
                                        return Promise.reject(error);
                                }

                                if (status === 401 && url !== '/autenticacao') {
                                        Notify.create({ type: 'negative', message: 'Conecte-se para prosseguir' })
                                        useAutenticacaoStore(store).limpar();
                                        void router.push({ name: 'conectar' });
                                }

                                const data = error.response?.data as { message?: string } | undefined;

                                Notify.create({
                                        type: 'negative',
                                        message: data?.message ?? error.message ?? 'Erro inesperado na requisição',
                                });
                        }

                        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
                },
        );

        app.config.globalProperties.$axios = axios;
        app.config.globalProperties.$api = api;
})

export { api };
