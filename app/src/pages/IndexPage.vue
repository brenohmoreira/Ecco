<template>
        <q-page class="flex items-center justify-center p-6">
                <q-card class="w-full max-w-md rounded-2xl p-2 shadow-xl">
                        <q-card-section>
                                <h1 class="text-primary text-2xl font-bold">Quasar + Tailwind</h1>
                                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        TypeScript, Pinia e Axios já configurados.
                                </p>
                        </q-card-section>

                        <q-card-section class="flex items-center gap-4">
                                <span class="text-4xl font-semibold">{{ counter.count }}</span>
                                <span class="text-gray-500">dobro: {{ counter.doubleCount }}</span>
                        </q-card-section>

                        <q-card-actions align="right" class="gap-2">
                                <q-btn flat label="Zerar" @click="counter.reset()" />
                                <q-btn
                                        color="primary"
                                        unelevated
                                        icon="add"
                                        label="Incrementar"
                                        @click="counter.increment()"
                                />
                        </q-card-actions>
                </q-card>
        </q-page>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';

const counter = useCounterStore();
</script>
