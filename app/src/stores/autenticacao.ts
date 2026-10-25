import { http } from "@/services/http";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export type Usuario = {
        id: number;
        usuario: string;
        nome: string;
        email: string;
}

export const useAutenticacaoStore = defineStore('autenticacao', () => {
        const usuario = ref<Usuario | null>(null);      
        const autenticado = computed(() => usuario.value !== null);
        let carregamento: Promise<void> | null = null; 

        function carregaSessao() {
                carregamento ??= http.get<Usuario>('/autenticacao/eu').then((resposta) => {
                        usuario.value = resposta; 
                }).catch(() => {
                        usuario.value = null 
                })

                return carregamento
        }

        async function entrar(email: string, senha: string) {
                usuario.value = await http.post<Usuario>('/autenticacao', { email, senha });
        }

        async function desconectar() {
                await http.post('/autenticacao/desconectar');
                limpar();
        }

        function limpar() {
                usuario.value = null;
        }

        return { usuario, autenticado, carregaSessao, entrar, desconectar, limpar }
});