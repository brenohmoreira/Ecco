import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../database/database.service.js";

export type Usuario = { id: number; usuario: string; email: string; senha: string; ativo: string };
export type UsuarioCriado = Pick<Usuario, "id" | "usuario" | "email">;

@Injectable()
export class AuthRepository {
        constructor(private readonly db: DatabaseService) {}

        async pesquisaPorEmail(email: string): Promise<Usuario | null> {
                return this.db.consultarUm<Usuario>(`
                                SELECT id, usuario, email, senha, ativo 
                                FROM Usuarios WHERE email = @email
                        `, { email }
                );
        }

        async criar(dados: Pick<Usuario, "usuario" | "email" | "senha">): Promise<UsuarioCriado> {
                const usuario = await this.db.consultarUm<UsuarioCriado>(`
                                INSERT INTO Usuarios (usuario, email, senha)
                                OUTPUT INSERTED.id, INSERTED.usuario, INSERTED.email
                                VALUES (@usuario, @email, @senha)
                        `, dados
                );

                return usuario!;
        }
}
