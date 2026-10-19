import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (senha: string, salt: string, tamanho: number) => Promise<Buffer>;
const TAMANHO_HASH = 64;

export async function gerarHashSenha(senha: string): Promise<string> {
        const salt = randomBytes(16).toString("hex");
        const hash = await scryptAsync(senha, salt, TAMANHO_HASH);

        return `${salt}:${hash.toString("hex")}`;
}

export async function verificarSenha(senha: string, armazenado: string): Promise<boolean> {
        const [salt, hashHex] = armazenado.split(":");

        if (!salt || !hashHex) return false;

        const hash = await scryptAsync(senha, salt, TAMANHO_HASH);
        const esperado = Buffer.from(hashHex, "hex");

        if (hash.length !== esperado.length) return false;

        return timingSafeEqual(hash, esperado);
}