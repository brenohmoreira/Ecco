<template> 
        <header class="w-full border-b-gray-300 border-b">
                <div class="q-pa-lg w-full flex items-center justify-between">
                        <div class="logo flex gap-4 items-center">
                                <EccoMark class="text-primary h-8 w-auto"/>
                                <span class="font-bold"> Ecco </span>
                        </div>

                        <div class="flex gap-4 items-center">
                                <q-input v-model="pesquisa" dense flat outlined input-class="text-caption" placeholder="Buscar">
                                        <template #append>
                                                <IconSearch class="text-zinc-400" size="20px"/>
                                        </template>        
                                </q-input>
                        </div>
                </div>
        </header>
</template>

<script lang="ts" setup>
import EccoMark from '@/components/EccoMark.vue';
import { useAutenticacaoStore } from '@/stores/autenticacao';
import { IconBell, IconSearch } from '@tabler/icons-vue';
import { ref } from 'vue';

const { usuario } = useAutenticacaoStore()
const pesquisa = ref('')
</script>