import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { gerarHashSenha, verificarSenha } from "../../common/utils/senha.js";
import { AuthRepository, type UsuarioCriado } from "./auth.repository.js";
import { CadastroDTO } from "./dto/cadastro.dto.js";
import { JwtService } from "@nestjs/jwt";
import { LoginDTO } from "./dto/login.dto.js";
import { JwtPayload } from "../../../types/express.js";

@Injectable()
export class AuthService {
        constructor(
                private readonly authRepository: AuthRepository,
                private readonly jwtService: JwtService
        ) {}

        async autenticar(dto: LoginDTO) {
                const email = dto.email.trim().toLowerCase();
                const usuario = await this.authRepository.pesquisaPorEmail(email);
                const valido = usuario !== null && usuario.ativo === "A" && await verificarSenha(dto.senha, usuario.senha)

                if (!valido) throw new UnauthorizedException("E-mail ou senha inválidos")

                const payload: JwtPayload = { sub: usuario.id, usuario: usuario.usuario, email: usuario.email };
                const token = await this.jwtService.signAsync(payload);

                return {
                        token,
                        usuario: { id: usuario.id, usuario: usuario.usuario, email: usuario.email }
                }
        }

        async usuarioDisponivel(usuario: string): Promise<boolean> {
                return !(await this.authRepository.usuarioExiste(usuario.trim().toLowerCase()));
        }

        async cadastrar(dto: CadastroDTO): Promise<UsuarioCriado> {
                const email = dto.email.trim().toLowerCase();
                const usuario = dto.usuario.trim().toLowerCase();

                if (await this.authRepository.pesquisaPorEmail(email)) throw new ConflictException("E-mail já cadastrado");
                if (await this.authRepository.usuarioExiste(usuario)) throw new ConflictException("Usuário já está em uso");

                const senha = await gerarHashSenha(dto.senha);

                return this.authRepository.criar({ usuario, nome: dto.nome.trim(), email, senha });
        }
}
