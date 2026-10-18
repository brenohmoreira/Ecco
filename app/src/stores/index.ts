import { defineStore } from '#q-app';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export default defineStore((/* { ssrContext } */) => {
        const pinia = createPinia();

        // Persiste stores marcadas com `persist: true` no localStorage
        pinia.use(piniaPluginPersistedstate);

        return pinia;
});
