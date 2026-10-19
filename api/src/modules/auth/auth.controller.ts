import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CadastroDTO } from "./dto/cadastro.dto.js";
import { LoginDTO } from "./dto/login.dto.js";
import { AuthService } from "./auth.service.js";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../config/env.validation.js";

import type { CookieOptions, Request, Response } from "express";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";

const COOKIE_TOKEN = "access_token";

@ApiTags('Autenticação')
@Controller('autenticacao')
export class AuthController {
        constructor(
                private authService: AuthService,
                private config: ConfigService<Env, true>
        ) {}

        @Post('')
        @HttpCode(HttpStatus.OK)
        async autentica(@Body() dto: LoginDTO, @Res({ passthrough: true }) res: Response) {
                const { token, usuario } = await this.authService.autenticar(dto);

                res.cookie(COOKIE_TOKEN, token, {
                        ...this.opcoesCookie(),
                        maxAge: this.config.get("JWT_EXPIRES_IN", { infer: true }) * 1000,
                });

                return usuario;
        }

        @Post('cadastro')
        async cadastro(@Body() dto: CadastroDTO) {
                return this.authService.cadastrar(dto);
        }
        
        @Get('eu')
        @UseGuards(JwtAuthGuard)
        eu(@Req() req: Request) {
                const { sub, usuario, email } = req.user!;
                return { id: sub, usuario, email };
        }

        @Post('desconectar')
        @HttpCode(HttpStatus.NO_CONTENT)
        desconectar(@Res({ passthrough: true }) res: Response) {
                res.clearCookie(COOKIE_TOKEN, this.opcoesCookie());
        }

        private opcoesCookie(): CookieOptions {
                return {
                        httpOnly: true,
                        secure: this.config.get("NODE_ENV", { infer: true }) === "production",
                        sameSite: "lax",
                        path: "/",
                };
        }
}