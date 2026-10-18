import { Inject, Injectable } from '@nestjs/common';
import { DB_POOL } from './database.constants.js';
import sql from "mssql";

type Parametros = Record<string, unknown>;

@Injectable()
export class DatabaseService {
        constructor(@Inject(DB_POOL) private readonly pool: sql.ConnectionPool) {}

        async consultar<T>(consulta: string, parametros: Parametros = {}, transacao?: sql.Transaction): Promise<T[]> {
                const result = await this.criarRequest(parametros, transacao).query<T>(consulta);
                return result.recordset;
        }

        async consultarUm<T>(consulta: string, parametros: Parametros = {}, transacao?: sql.Transaction): Promise<T | null> {
                const linhas = await this.consultar<T>(consulta, parametros, transacao);
                return linhas[0] ?? null;
        }

        async executar(consulta: string, parametros: Parametros = {}, transacao?: sql.Transaction): Promise<number> {
                const result = await this.criarRequest(parametros, transacao).query(consulta);
                return result.rowsAffected.reduce((total, n) => total + n, 0);
        }

        async transacao<T>(callback: (transacao: sql.Transaction) => Promise<T>): Promise<T> {
                const transacao = new sql.Transaction(this.pool);
                await transacao.begin();

                try {
                        const resultado = await callback(transacao);
                        await transacao.commit();
                        return resultado;
                } 
                catch (erro) {
                        await transacao.rollback();
                        throw erro;
                }
        }

        private criarRequest(parametros: Parametros, transacao?: sql.Transaction): sql.Request {
                const request = transacao ? new sql.Request(transacao) : this.pool.request();

                for (const [nome, valor] of Object.entries(parametros)) {
                        request.input(nome, valor);
                }

                return request;
        }
}