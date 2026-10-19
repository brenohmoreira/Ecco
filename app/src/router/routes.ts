import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
        {
                path: '/',
                component: () => import('@/layouts/MainLayout.vue'),
                children: [
                        {
                                path: '',
                                name: 'home',
                                component: () => import('@/pages/IndexPage.vue'),
                        },
                ],
        },

        {
                path: '/login',
                component: () => import('@/layouts/AuthLayout.vue'),
                meta: { publica: true },
                children: [
                        {
                                path: '',
                                name: 'login',
                                component: () => import('@/pages/LoginPage.vue'),
                        },
                ],
        },
        {
                path: '/:catchAll(.*)*',
                component: () => import('@/pages/ErrorNotFound.vue'),
        },
];

export default routes;
