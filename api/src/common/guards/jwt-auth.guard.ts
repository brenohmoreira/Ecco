import { JwtPayload } from "../../../types/express.js";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable() 
export class JwtAuthGuard implements CanActivate {
        constructor(private readonly jwtService: JwtService) {}

        async canActivate(context: ExecutionContext): Promise<boolean> {
                const requisicao = context.switchToHttp().getRequest<Request>();
                const token = requisicao.cookies?.access_token as string | undefined;

                if (!token) throw new UnauthorizedException("Não autenticado")

                try {
                        requisicao.user = await this.jwtService.verifyAsync<JwtPayload>(token);
                }
                catch {
                        throw new UnauthorizedException("Sessão expirada ou inválida");
                }

                return true;
        }
}