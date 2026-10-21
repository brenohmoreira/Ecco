import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../database/database.service.js";

export type Usuario = { id: number; usuario: string; nome: string; email: string; senha: string; ativo: string };
export type UsuarioCriado = Pick<Usuario, "id" | "usuario" | "nome" | "email">;

@Injectable()
export class AuthRepository {
        constructor(private readonly db: DatabaseService) {}

        async pesquisaPorEmail(email: string): Promise<Usuario | null> {
                return this.db.consultarUm<Usuario>(`
                                SELECT id, usuario, nome, email, senha, ativo 
                                FROM Usuarios WHERE email = @email
                        `, { email }
                );
        }

        async usuarioExiste(usuario: string): Promise<boolean> {
                const encontrado = await this.db.consultarUm<{ id: number }>(`
                                SELECT id FROM Usuarios WHERE usuario = @usuario
                        `, { usuario }
                );

                return encontrado !== null;
        }

        async criar(dados: Pick<Usuario, "usuario" | "nome" | "email" | "senha">): Promise<UsuarioCriado> {
                return this.db.transacao(async (transacao) => {
                        const usuario = await this.db.consultarUm<UsuarioCriado>(`
                                        INSERT INTO Usuarios (usuario, nome, email, senha)
                                        OUTPUT INSERTED.id, INSERTED.usuario, INSERTED.nome, INSERTED.email
                                        VALUES (@usuario, @nome, @email, @senha)
                                `, dados, transacao
                        );

                        await this.db.executar(`
                                        INSERT INTO UsuariosPerfil (idUsuario) VALUES (@idUsuario)
                                `, { idUsuario: usuario!.id }, transacao
                        );

                        return usuario!;
                });
        }
}
