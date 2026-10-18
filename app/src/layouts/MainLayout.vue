<template>
        <q-layout view="lHh Lpr lFf">
                <q-header elevated>
                        <q-toolbar>
                                <q-toolbar-title>Ecco</q-toolbar-title>

                                <q-btn
                                        flat
                                        round
                                        dense
                                        :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
                                        aria-label="Alternar tema"
                                        @click="$q.dark.toggle()"
                                />
                        </q-toolbar>
                </q-header>

                <q-page-container>
                        <router-view />
                </q-page-container>
        </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();
</script>
