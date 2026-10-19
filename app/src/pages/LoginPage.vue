<template>
        <q-page class="flex items-center justify-center px-6 py-12">
                <div class="w-full max-w-75">
                        <div class="w-full flex items-center justify-start mb-3"> 
                                <EccoMark class="text-primary h-7 w-auto" />
                                <div class="column ml-3">
                                        <span class="text-caption font-bold"> Ecco - Log in </span>
                                        <span class="text-caption font-medium"> Insira suas credenciais </span>
                                </div>
                        </div>

                        <q-form class="flex flex-col mt-5" @submit="aoClicar">
                                <label for="login-email" class="mb-1 text-[11px] font-medium text-gray-600 dark:text-gray-300"> E-mail </label>
                                <q-input v-model="email" for="login-email" type="email" outlined dense input-class="text-[12px]"/>

                                <label for="login-password" class="text-[11px] mt-2 font-medium text-gray-600 dark:text-gray-300"> Senha </label>
                                <q-input v-model="senha" for="login-password" :type="mostrarSenha ? 'text' : 'password'" autocomplete="current-password" outlined dense input-class="text-[12px]">
                                        <template #append>
                                                <q-btn flat round dense size="xs" class="text-gray-400" :icon="mostrarSenha ? 'visibility_off' : 'visibility'" :aria-label="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'" @click="mostrarSenha = !mostrarSenha"/>
                                        </template>
                                </q-input>

                                <span class="text-primary text-[11px] block mt-3 cursor-pointer brightness-95 transition-all duration-300"> Esqueci minha senha </span>
                                
                                <q-btn :loading="carregando" type="submit" label="Entrar" color="primary" text-color="white" unelevated no-caps class="mt-4 h-10 w-full py-1.5 text-caption font-medium"/>
                        </q-form>

                        <p class="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
                                Não tem uma conta?
                                <router-link to="/login" class="text-primary font-medium no-underline hover:underline dark:text-white">
                                        Criar conta
                                </router-link>
                        </p>
                </div>
        </q-page>
</template>

<script setup lang="ts">
        import { ref } from 'vue';
        import EccoMark from '@/components/EccoMark.vue';
        import { useAutenticacaoStore } from '@/stores/autenticacao';
        import { useRoute, useRouter } from 'vue-router';

        const autenticacao = useAutenticacaoStore()
        const email = ref('');
        const senha = ref('');
        const mostrarSenha = ref(false);
        const carregando = ref(false) 
        const router = useRouter()
        const route = useRoute() 

        async function aoClicar() {
                carregando.value = true 

                try {
                        await autenticacao.entrar(email.value, senha.value)
                        const redireciopnar = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
                        await router.push(redireciopnar)
                }
                finally {
                        carregando.value = false 
                }
        }
</script>
