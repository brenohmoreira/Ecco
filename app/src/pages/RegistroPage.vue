<template> 
        <q-page class="flex items-center justify-center px-6 py-12">
                <div class="w-full max-w-75">
                        <div class="w-full flex items-center justify-start mb-3"> 
                                <EccoMark class="text-primary h-7 w-auto" />
                                <div class="column ml-3">
                                        <span class="text-caption font-bold"> Ecco - Cadastro </span>
                                        <span class="text-caption font-medium"> Insira suas credenciais </span>
                                </div>
                        </div>

                        <q-form class="flex flex-col mt-5" @submit="aoClicar">
                                <label for="cadastro-usuario" class="text-[11px] mb-1 font-medium text-gray-600"> Usuário </label>
                                <q-input v-model="usuario" for="cadastro-usuario" type="text" outlined dense input-class="text-[12px]"/>

                                <label for="cadastro-email" class="mb-1 mt-2 text-[11px] font-medium text-gray-600"> E-mail </label>
                                <q-input v-model="email" for="cadastro-email" type="email" outlined dense input-class="text-[12px]"/>

                                <label for="cadastro-password" class="text-[11px] mt-2 font-medium text-gray-600"> Senha </label>
                                <q-input v-model="senha" for="cadastro-password" :type="mostrarSenha ? 'text' : 'password'" autocomplete="current-password" outlined dense input-class="text-[12px]">
                                        <template #append>
                                                <q-btn flat round dense size="xs" class="text-gray-400" :icon="mostrarSenha ? 'visibility_off' : 'visibility'" :aria-label="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'" @click="mostrarSenha = !mostrarSenha"/>
                                        </template>
                                </q-input>

                                <label for="cadastro-confirma-password" class="text-[11px] mt-2 font-medium text-gray-600"> Confirmar senha </label>
                                <q-input v-model="confirmaSenha" for="cadastro-confirma--password" :type="mostrarConfirmaSenha ? 'text' : 'password'" autocomplete="current-password" outlined dense input-class="text-[12px]">
                                        <template #append>
                                                <q-btn flat round dense size="xs" class="text-gray-400" :icon="mostrarConfirmaSenha ? 'visibility_off' : 'visibility'" :aria-label="mostrarConfirmaSenha ? 'Ocultar senha' : 'Mostrar senha'" @click="mostrarConfirmaSenha = !mostrarConfirmaSenha"/>
                                        </template>
                                </q-input>
                                
                                <q-btn :loading="carregando" type="submit" label="Cadastrar" color="primary" text-color="white" unelevated no-caps class="mt-4 h-10 w-full py-1.5 text-caption font-medium"/>
                        </q-form>

                        <p class="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                                Já possui uma conta? 
                                <router-link :to="{ name: 'conectar' }" class="text-primary font-medium no-underline hover:underline dark:text-white">
                                        Conecte-se
                                </router-link>
                        </p>
                </div>
        </q-page>
</template>

<script setup lang="ts">
        import { ref } from 'vue';
        import EccoMark from '@/components/EccoMark.vue';
        import { useRouter } from 'vue-router';
        import { Notify } from 'quasar';
        import { http } from '@/services/http';

        const email = ref('');
        const senha = ref('');
        const confirmaSenha = ref('');
        const usuario = ref('');
        const mostrarSenha = ref(false);
        const mostrarConfirmaSenha = ref(false);
        const carregando = ref(false);
        const router = useRouter();

        function erro(mensagem: string) {
                Notify.create({
                        type: 'negative',
                        message: mensagem,
                })
        }

        const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const REGEX_SENHA = /^\S+$/;

        function validaDados(): boolean {
                if (senha.value.trim() === '') {
                        erro("Digite uma senha antes de prosseguir")
                        return false
                }

                if (!REGEX_SENHA.test(senha.value)) {
                        erro("A senha não pode conter espaços")
                        return false
                }

                if (senha.value !== confirmaSenha.value) {
                        erro("As senhas digitadas não coincidem")
                        return false
                }

                if (!REGEX_EMAIL.test(email.value.trim())) {
                        erro("Digite um e-mail válido")
                        return false 
                }

                if (usuario.value.trim() === '') {
                        erro("Digite um usuário válido")
                        return false 
                }

                return true 
        }

        async function aoClicar() {
                if (!validaDados()) return 

                carregando.value = true 

                try {
                        await http.post('/autenticacao/cadastro', { email: email.value, usuario: usuario.value, senha: senha.value })
                        Notify.create({ type: 'positive', message: 'Cadastrado com sucesso. Conecte-se para prosseguir'})
                        await router.push({ name: 'conectar' })
                }
                catch (error) {
                        erro(error instanceof Error ? error.message : "Erro ao se cadastrar")
                }
                finally {
                        carregando.value = false 
                }
        }
</script>