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
                                <label for="cadastro-nome" class="text-[11px] mb-1 font-medium text-gray-600"> Nome </label>
                                <q-input v-model="nome" for="cadastro-nome" autofocus type="text" maxlength="100" autocomplete="name" outlined dense input-class="text-[12px]"/>

                                <label for="cadastro-usuario" class="text-[11px] mb-1 mt-2 font-medium text-gray-600"> Usuário </label>
                                <q-input v-model="usuario" for="cadastro-usuario" type="text" prefix="@" maxlength="40" autocomplete="username" outlined dense input-class="text-[12px]" @keydown.enter.prevent="verificarUsuario">
                                        <template #append>
                                                <q-btn flat round dense size="xs" tabindex="-1" :loading="verificando" :class="corDisponibilidade" :icon="iconeDisponibilidade" aria-label="Verificar disponibilidade do usuário" @click="verificarUsuario"/>
                                        </template>
                                </q-input>
                                <span v-if="disponivel !== null" class="text-[11px] mt-1" :class="disponivel ? 'text-positive' : 'text-negative'">
                                        {{ disponivel ? 'Usuário disponível' : 'Usuário já está em uso' }}
                                </span>

                                <label for="cadastro-email" class="mb-1 mt-2 text-[11px] font-medium text-gray-600"> E-mail </label>
                                <q-input v-model="email" for="cadastro-email" type="email" maxlength="254" outlined dense input-class="text-[12px]"/>

                                <label for="cadastro-password" class="text-[11px] mt-2 font-medium text-gray-600"> Senha </label>
                                <q-input v-model="senha" for="cadastro-password" maxlength="128" :type="mostrarSenha ? 'text' : 'password'" autocomplete="current-password" outlined dense input-class="text-[12px]">
                                        <template #append>
                                                <q-btn flat round dense size="xs" tabindex="-1" class="text-gray-400" :icon="mostrarSenha ? 'visibility_off' : 'visibility'" :aria-label="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'" @click="mostrarSenha = !mostrarSenha"/>
                                        </template>
                                </q-input>

                                <label for="cadastro-confirma-password" class="text-[11px] mt-2 font-medium text-gray-600"> Confirmar senha </label>
                                <q-input v-model="confirmaSenha" for="cadastro-confirma-password" maxlength="128" :type="mostrarConfirmaSenha ? 'text' : 'password'" autocomplete="current-password" outlined dense input-class="text-[12px]">
                                        <template #append>
                                                <q-btn flat round dense size="xs" tabindex="-1" class="text-gray-400" :icon="mostrarConfirmaSenha ? 'visibility_off' : 'visibility'" :aria-label="mostrarConfirmaSenha ? 'Ocultar senha' : 'Mostrar senha'" @click="mostrarConfirmaSenha = !mostrarConfirmaSenha"/>
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
        import { computed, ref, watch } from 'vue';
        import EccoMark from '@/components/EccoMark.vue';
        import { useRouter } from 'vue-router';
        import { Notify } from 'quasar';
        import { http } from '@/services/http';

        const email = ref('');
        const senha = ref('');
        const confirmaSenha = ref('');
        const usuario = ref('');
        const nome = ref('');
        const disponivel = ref<boolean | null>(null);
        const verificando = ref(false);
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
        const REGEX_USUARIO = /^[a-zA-Z0-9._]+$/;
        const MIN_SENHA = 8;
        const MAX_SENHA = 128;
        const MAX_EMAIL = 254;
        const MAX_USUARIO = 40;
        const MAX_NOME = 100;

        const iconeDisponibilidade = computed(() => disponivel.value === null ? 'search' : disponivel.value ? 'check_circle' : 'cancel');
        const corDisponibilidade = computed(() => disponivel.value === null ? 'text-gray-400' : disponivel.value ? 'text-positive' : 'text-negative');

        // O @ é só visual (prefix do input); se a pessoa digitar, removemos. Espaços também não são aceitos
        watch(usuario, (valor) => {
                const limpo = valor.replace(/^@+/, '').replace(/\s/g, '');
                if (limpo !== valor) usuario.value = limpo;
                disponivel.value = null;
        });

        function validaUsuario(): boolean {
                if (usuario.value.trim() === '') {
                        erro("Digite um usuário válido")
                        return false
                }

                if (usuario.value.trim().length > MAX_USUARIO) {
                        erro(`O usuário deve ter no máximo ${MAX_USUARIO} caracteres`)
                        return false
                }

                if (!REGEX_USUARIO.test(usuario.value.trim())) {
                        erro("O usuário só pode conter letras, números, ponto e underline")
                        return false
                }

                return true
        }

        async function verificarUsuario() {
                if (!validaUsuario()) return

                verificando.value = true

                try {
                        const resposta = await http.get<{ disponivel: boolean }>('/autenticacao/usuario-disponivel', { params: { usuario: usuario.value.trim() } })
                        disponivel.value = resposta.disponivel
                }
                catch {
                        disponivel.value = null
                }
                finally {
                        verificando.value = false
                }
        }

        function validaDados(): boolean {
                if (senha.value.trim() === '') {
                        erro("Digite uma senha antes de prosseguir")
                        return false
                }

                if (!REGEX_SENHA.test(senha.value)) {
                        erro("A senha não pode conter espaços")
                        return false
                }

                if (senha.value.length < MIN_SENHA || senha.value.length > MAX_SENHA) {
                        erro(`A senha deve ter entre ${MIN_SENHA} e ${MAX_SENHA} caracteres`)
                        return false
                }

                if (senha.value !== confirmaSenha.value) {
                        erro("As senhas digitadas não coincidem")
                        return false
                }

                if (!REGEX_EMAIL.test(email.value.trim()) || email.value.trim().length > MAX_EMAIL) {
                        erro("Digite um e-mail válido")
                        return false 
                }

                if (nome.value.trim() === '' || nome.value.trim().length > MAX_NOME) {
                        erro(`Digite um nome de até ${MAX_NOME} caracteres`)
                        return false
                }

                if (!validaUsuario()) return false

                if (disponivel.value === false) {
                        erro("Usuário já está em uso")
                        return false
                }

                return true
        }

        async function aoClicar() {
                if (!validaDados()) return 

                carregando.value = true 

                try {
                        await http.post('/autenticacao/cadastro', { email: email.value, usuario: usuario.value.trim(), nome: nome.value.trim(), senha: senha.value })
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