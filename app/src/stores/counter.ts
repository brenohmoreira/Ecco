import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useCounterStore = defineStore(
        'counter',
        () => {
                const count = ref(0);
                const doubleCount = computed(() => count.value * 2);

                function increment() {
                        count.value++;
                }

                function reset() {
                        count.value = 0;
                }

                return { count, doubleCount, increment, reset };
        },
        { persist: true },
);

if (import.meta.hot) {
        import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot));
}
