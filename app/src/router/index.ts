import { defineRouter } from '#q-app';
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import routes from './routes';
import { useAutenticacaoStore } from '@/stores/autenticacao';

export default defineRouter(function ({ store }) {
        const createHistory = import.meta.env.QUASAR_SERVER ? createMemoryHistory : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory;

        const Router = createRouter({
                scrollBehavior: () => ({ left: 0, top: 0 }),
                routes,
                history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE),
        });

        Router.beforeEach(async (to) => {
                const autenticacao = useAutenticacaoStore(store)
                
                await autenticacao.carregaSessao();

                const publica = to.matched.some((r) => r.meta.publica)

                if (!publica && !autenticacao.autenticado)
                        return { name: 'conectar', query: { redirect: to.fullPath } }

                if (publica && autenticacao.autenticado)
                        return { name: 'home' }
        })

        return Router;
});
