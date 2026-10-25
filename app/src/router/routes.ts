import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
        {
                path: '/',
                component: () => import('@/layouts/MainLayout.vue'),
                children: [
                        {
                                path: '',
                                name: 'feed',
                                component: () => import('@/pages/Feed/FeedPage.vue'),
                        },
                ],
        },

        {
                path: '/autenticacao',
                component: () => import('@/layouts/AuthLayout.vue'),
                meta: { publica: true },
                children: [
                        {
                                path: 'conectar',
                                name: 'conectar',
                                component: () => import('@/pages/LoginPage.vue'),
                        },
                        {
                                path: 'cadastrar',
                                name: 'cadastrar',
                                component: () => import('@/pages/RegistroPage.vue')
                        }
                ],
        },
        {
                path: '/:catchAll(.*)*',
                component: () => import('@/pages/ErrorNotFound.vue'),
        },
];

export default routes;
